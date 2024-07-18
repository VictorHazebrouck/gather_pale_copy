import eventBus from "../EventBus";

export default {
    /** @type {string[]} */
    nearbyPlayers: [],

    _isInit: false,
    async init() {
        if (!this._isInit) {
            return;
        } else {
            this._isInit = true;
        }

        eventBus.subscribe("game_player_join_nearby_area", ({ userId }) => {
            this.nearbyPlayers.push(userId);
        });
        eventBus.subscribe("game_player_leave_nearby_area", ({ userId }) => {
            this.nearbyPlayers.filter((e) => e !== userId);
        });
    },
};
