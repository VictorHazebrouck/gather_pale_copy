import Alpine from "alpinejs";
import eventBus from "../EventBus";

export default {
    /**
     * @typedef {object} RemoteStream
     * @property {MediaStream | null} stream
     * @property {MediaStream | null} screenShare
     * @property {string} userId
     */

    /** @type {RemoteStream[]} */
    nearbyPlayers: [],

    _isInit: false,
    async init() {
        if (this._isInit) {
            return;
        } else {
            this._isInit = true;
        }

        eventBus.subscribe("game_player_join_nearby_area", ({ userId }) => {
            this.nearbyPlayers.push({
                stream: null,
                screenShare: null,
                userId: userId,
            });

            eventBus.publish("peer_initiate_call_request", {
                userIdReceiver: userId,
                userIdCaller: Alpine.store("user").userId,
            });
        });

        eventBus.subscribe("peer_receive_media_stream", ({ userIdCaller, stream }) => {
            const i = this.nearbyPlayers.findIndex((e) => e.userId === userIdCaller);

            if (i === -1) {
                console.log("error, could find corresponding player");
                return;
            }

            this.nearbyPlayers[i] = { ...this.nearbyPlayers[i], stream: stream };
        });

        eventBus.subscribe("game_player_leave_nearby_area", ({ userId }) => {
            this.nearbyPlayers = this.nearbyPlayers.filter((e) => e.userId !== userId);
        });

        eventBus.subscribe("player_disconnected", ({ userId }) => {
            this.nearbyPlayers = this.nearbyPlayers.filter((e) => e.userId !== userId);
        });
    },
};
