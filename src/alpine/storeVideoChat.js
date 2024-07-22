import Alpine from "alpinejs";
import eventBus from "../EventBus";

export default {
    /**
     * @typedef {object} RemoteStream
     * @property {MediaStream | null} stream
     * @property {MediaStream | null} screenShare
     * @property {boolean} isSoundEnabled
     * @property {boolean} isVideoEnabled
     * @property {string} userId
     */

    /** @type {RemoteStream[]} */
    nearbyPlayers: [],
    /** @type {MediaStream | null} */
    myStream: null,
    /** @type {MediaStream | null} */
    myScreenShare: null,
    isMySoundEnabled: Alpine.$persist(false),
    isMyVideoEnabled: Alpine.$persist(false),
    isMyScreenshareEnabled: false,

    muteVideo() {
        this.isMyVideoEnabled = !this.isMyVideoEnabled;
        this.myStream?.getVideoTracks().forEach((track) => (track.enabled = this.isMyVideoEnabled));
        eventBus.publish("initiate_video_mute_change", this.isMyVideoEnabled);
    },
    muteAudio() {
        this.isMySoundEnabled = !this.isMySoundEnabled;
        this.myStream?.getAudioTracks().forEach((track) => (track.enabled = this.isMySoundEnabled));
        eventBus.publish("initiate_audio_mute_change", this.isMySoundEnabled);
    },
    shareScreen() {
        this.isMyScreenshareEnabled = !this.isMyScreenshareEnabled;
    },

    _isInit: false,
    async init() {
        if (this._isInit) {
            return;
        } else {
            this._isInit = true;
        }

        await this.initializePersonalVideoStream();

        eventBus.subscribe("game_player_join_nearby_area", ({ userId }) => {
            console.log("player nearby !!");
            this.nearbyPlayers.push({
                userId: userId,
                stream: null,
                screenShare: null,
                isSoundEnabled: false,
                isVideoEnabled: false,
            });

            eventBus.publish("peer_initiate_call_request", {
                userIdReceiver: userId,
                userIdCaller: Alpine.store("user").userId,
            });

            eventBus.publish("initiate_audio_mute_change", this.isMySoundEnabled);
            eventBus.publish("initiate_video_mute_change", this.isMyVideoEnabled);
        });

        eventBus.subscribe("peer_receive_media_stream", (data) => {
            const { userIdCaller, stream } = data;

            const i = this.nearbyPlayers.findIndex((e) => e.userId === userIdCaller);

            if (i === -1) {
                console.error("error, could find corresponding player");
                return;
            }

            this.nearbyPlayers[i] = {
                ...this.nearbyPlayers[i],
                stream: stream,
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
            const i = this.nearbyPlayers.findIndex((e) => e.userId === userId);

            if (i === -1) {
                return;
            }

            this.nearbyPlayers[i].isSoundEnabled = state;
        });

        eventBus.subscribe("receive_video_mute_change", ({ userId, state }) => {
            const i = this.nearbyPlayers.findIndex((e) => e.userId === userId);

            if (i === -1) {
                return;
            }

            this.nearbyPlayers[i].isVideoEnabled = state;
        });
    },

    /**
     * Handle personnal video stream authoriation request
     */
    async initializePersonalVideoStream() {
        try {
            // Request access to the camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            // sync muted and video state
            this.myStream = stream;
            this.myStream
                .getVideoTracks()
                .forEach((track) => (track.enabled = this.isMyVideoEnabled));
            this.myStream
                .getAudioTracks()
                .forEach((track) => (track.enabled = this.isMySoundEnabled));

            // share reference to my video stream to the rest of the application
            eventBus.publish("personal_media_stream_initialized", this.myStream);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    },

    /** @param {string} userId  */
    cleanupPlayer(userId) {
        const player = this.nearbyPlayers.find((e) => e.userId === userId);
        if (player && player.stream) {
            player.stream.getTracks().forEach((track) => track.stop());
        }
        this.nearbyPlayers = this.nearbyPlayers.filter((e) => e.userId !== userId);
    },
};
