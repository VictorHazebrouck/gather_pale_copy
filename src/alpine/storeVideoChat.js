import Alpine from "alpinejs";
import eventBus from "../EventBus";
import {
    requestScreencastVideoTrack,
    requestWebcamAndAudioTracks,
    muteWebcamTrack,
    muteAudioTrack,
} from "../utils/videoStuff";

/** @type {VideoChatStore} */
export default {
    nearbyPlayers: [],
    myStream: new MediaStream(),
    isMySoundEnabled: false,
    isMyVideoEnabled: false,
    isMyScreenshareEnabled: false,

    async shareScreen() {
        if (!this.isMyScreenshareEnabled) {
            await this.initializeScreenCastStream();
            this.isMyScreenshareEnabled = true;
        } else {
            const track = this.myStream.getTracks().find((track) => track.contentHint === "detail");

            if (!track) {
                return console.error("Couldt find screencast ");
            }
            track.stop();
            this.myStream.removeTrack(track);
            this.myStream.dispatchEvent(
                new CustomEvent("removetrack", {
                    detail: this.nearbyPlayers,
                })
            );

            this.isMyScreenshareEnabled = false;
        }
    },

    async initializeScreenCastStream() {
        const [track, err] = await requestScreencastVideoTrack();

        if (err !== null) {
            return console.error("Error getting screencast", err);
        }

        track.addEventListener("ended", () => {
            this.myStream.removeTrack(track);
            this.myStream.dispatchEvent(
                new CustomEvent("removetrack", { detail: this.nearbyPlayers })
            );
            this.isMyScreenshareEnabled = false;
        });

        this.myStream.addTrack(track);
        this.myStream.dispatchEvent(new CustomEvent("addtrack", { detail: this.nearbyPlayers }));
    },

    async initializePersonalVideoStream() {
        const [videoTrack, audioTrack, err] = await requestWebcamAndAudioTracks();

        if (err) {
            return console.error("Error getting stream", err);
        }

        this.myStream.addTrack(videoTrack);
        this.myStream.addTrack(audioTrack);
        this.myStream.dispatchEvent(new Event("addtrack"));

        eventBus.publish("personal_media_stream_initialized", this.myStream);
    },

    muteVideo() {
        if (!this.myStream) return this.initializePersonalVideoStream();

        this.isMyVideoEnabled = !this.isMyVideoEnabled;

        const err = muteWebcamTrack(this.myStream, this.isMyVideoEnabled);

        if (err !== null) {
            return console.error("Couldn't find webcam track");
        }

        eventBus.publish("initiate_video_mute_change", this.isMyVideoEnabled);
    },

    muteAudio() {
        if (!this.myStream) return this.initializePersonalVideoStream();

        this.isMySoundEnabled = !this.isMySoundEnabled;

        const err = muteAudioTrack(this.myStream, this.isMySoundEnabled);

        if (err !== null) {
            return console.error("Couldn't find audio track");
        }

        eventBus.publish("initiate_audio_mute_change", this.isMySoundEnabled);
    },

    cleanupPlayer(userId) {
        const player = this.nearbyPlayers.find((e) => e.userId === userId);
        if (player && player.stream) {
            player.stream.getTracks().forEach((track) => track.stop());
        }
        this.nearbyPlayers = this.nearbyPlayers.filter((e) => e.userId !== userId);
    },

    async init() {
        if (this._isInit) return;
        this._isInit = true;

        this.initializePersonalVideoStream();

        eventBus.subscribe("game_player_join_nearby_area", ({ userId }) => {
            console.log("player joining nearby area...");

            const i = this.nearbyPlayers.findIndex((e) => e.userId === userId);

            if (i === -1) {
                this.nearbyPlayers.push({
                    userId: userId,
                    stream: null,
                    screenShare: null,
                    isSoundEnabled: false,
                    isVideoEnabled: false,
                });
            }

            eventBus.publish("peer_initiate_call_request", {
                userIdReceiver: userId,
                userIdCaller: Alpine.store("user").userId,
            });

            setTimeout(() => {
                eventBus.publish("initiate_audio_mute_change", this.isMySoundEnabled);
                eventBus.publish("initiate_video_mute_change", this.isMyVideoEnabled);
            }, 1000);
        });

        eventBus.subscribe("peer_receive_media_stream", (data) => {
            console.log("receiveing media stream: ", data.stream.getTracks());
            // don't destructure data.stream in order to keep to original referecence

            const i = this.nearbyPlayers.findIndex((e) => e.userId === data.userIdCaller);

            if (i === -1) {
                this.nearbyPlayers.push({
                    userId: data.userIdCaller,
                    stream: data.stream,
                    screenShare: null,
                    isSoundEnabled: false,
                    isVideoEnabled: false,
                });
                return;
            }

            const temp = [...this.nearbyPlayers];
            // if player does exist and does not already have a stream, only add a videostream to its existing obj
            temp[i] = {
                ...this.nearbyPlayers[i],
                stream: data.stream,
            };

            setTimeout(() => {
                this.nearbyPlayers = [];
                setTimeout(() => {
                    this.nearbyPlayers = temp;
                }, 50);
            }, 50);
        });

        eventBus.subscribe("receive_audio_mute_change", ({ userId, state }) => {
            const i = this.nearbyPlayers.findIndex((e) => e.userId === userId);

            if (i !== -1) {
                this.nearbyPlayers[i] = { ...this.nearbyPlayers[i], isSoundEnabled: state };
            }
        });

        eventBus.subscribe("receive_video_mute_change", ({ userId, state }) => {
            const i = this.nearbyPlayers.findIndex((e) => e.userId === userId);

            if (i !== -1) {
                this.nearbyPlayers[i] = { ...this.nearbyPlayers[i], isVideoEnabled: state };
            }
        });
        eventBus.subscribe("game_player_leave_nearby_area", ({ userId }) => {
            this.cleanupPlayer(userId);
        });

        eventBus.subscribe("player_disconnected", ({ userId }) => {
            this.cleanupPlayer(userId);
        });
    },
    _isInit: false,
};
