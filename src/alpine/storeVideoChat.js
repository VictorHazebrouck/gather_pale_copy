import Alpine from "alpinejs";
import eventBus from "../EventBus";

/** @type {VideoChatStore} */
export default {
    nearbyPlayers: [],

    myStream: null,
    myScreenShare: null,

    isMySoundEnabled: Alpine.$persist(false),
    isMyVideoEnabled: Alpine.$persist(false),
    isMyScreenshareEnabled: false,

    muteVideo() {
        if (!this.myStream) {
            return this.initializePersonalVideoStream();
        }

        this.isMyVideoEnabled = !this.isMyVideoEnabled;
        this.myStream?.getVideoTracks().forEach((track) => (track.enabled = this.isMyVideoEnabled));
        eventBus.publish("initiate_video_mute_change", this.isMyVideoEnabled);
    },
    muteAudio() {
        if (!this.myStream) {
            return this.initializePersonalVideoStream();
        }

        this.isMySoundEnabled = !this.isMySoundEnabled;
        this.myStream?.getAudioTracks().forEach((track) => (track.enabled = this.isMySoundEnabled));
        eventBus.publish("initiate_audio_mute_change", this.isMySoundEnabled);
    },
    async shareScreen() {
        if (!this.isMyScreenshareEnabled) {
            await this.initializeScreenCastStream();
            this.isMyScreenshareEnabled = true;
        } else {
            this.isMyScreenshareEnabled = false;
        }
    },

    async initializePersonalVideoStream() {
        try {
            // Request access to the camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            // sync muted and video state
            stream.getVideoTracks().forEach((track) => (track.enabled = this.isMyVideoEnabled));
            stream.getAudioTracks().forEach((track) => (track.enabled = this.isMySoundEnabled));
            this.myStream = stream;

            // share reference to my video stream to the rest of the application
            eventBus.publish("personal_media_stream_initialized", this.myStream);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    },

    async initializeScreenCastStream() {
        try {
            // Request access to the camera
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            });

            this.myScreenShare = stream;

            // share reference to my video stream to the rest of the application
            eventBus.publish("screencast_media_stream_initialized", {
                screenshare: this.myScreenShare,
                nearplayers: this.nearbyPlayers,
            });
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    },

    cleanupPlayer(userId) {
        const player = this.nearbyPlayers.find((e) => e.userId === userId);
        if (player && player.stream) {
            player.stream.getTracks().forEach((track) => track.stop());
        }
        this.nearbyPlayers = this.nearbyPlayers.filter((e) => e.userId !== userId);
    },

    _isInit: false,
    async init() {
        if (this._isInit) {
            return;
        } else {
            this._isInit = true;
        }

        this.initializePersonalVideoStream();

        eventBus.subscribe("game_player_join_nearby_area", ({ userId }) => {
            console.log("player joining nearby area...");

            const i = this.nearbyPlayers.findIndex((e) => e.userId === userId);

            // if player don't exist yes, create it
            if (i === -1) {
                this.nearbyPlayers.push({
                    userId: userId,
                    stream: null,
                    screenShare: null,
                    isSoundEnabled: false,
                    isVideoEnabled: false,
                });
            }

            // initiate video call
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
            console.log("player calling...");
            // don't destructure data.stream in order to keep to original referecence

            const i = this.nearbyPlayers.findIndex((e) => e.userId === data.userIdCaller);

            // if player don't exist yet, add him together with his stream
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

            // if player does exist and does not already have a stream, only add a videostream to its existing obj
            this.nearbyPlayers[i] = {
                ...this.nearbyPlayers[i],
                stream: data.stream,
            };

            return;
        });

        eventBus.subscribe("game_player_leave_nearby_area", ({ userId }) => {
            this.cleanupPlayer(userId);
        });

        eventBus.subscribe("player_disconnected", ({ userId }) => {
            this.cleanupPlayer(userId);
        });

        eventBus.subscribe("receive_audio_mute_change", ({ userId, state }) => {
            console.log("receiving audio mute state...", state);
            const i = this.nearbyPlayers.findIndex((e) => e.userId === userId);

            if (i === -1) {
                return;
            }

            this.nearbyPlayers[i] = { ...this.nearbyPlayers[i], isSoundEnabled: state };
        });

        eventBus.subscribe("receive_video_mute_change", ({ userId, state }) => {
            console.log("receiving video mute state...", state);
            const i = this.nearbyPlayers.findIndex((e) => e.userId === userId);

            if (i === -1) {
                return;
            }

            this.nearbyPlayers[i] = { ...this.nearbyPlayers[i], isVideoEnabled: state };
        });
    },
};
