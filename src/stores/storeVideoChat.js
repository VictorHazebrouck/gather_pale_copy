import eventBus from "../EventBus";

export default {
    /** @type {string[]} */
    nearbyPlayers: [],

    _isInit: false,
    async init() {
        if (this._isInit) {
            return;
        } else {
            this._isInit = true;
        }

        eventBus.subscribe("game_player_join_nearby_area", ({ userId }) => {
            this.nearbyPlayers.push(userId);
            console.log("new player nearby", this.nearbyPlayers);
        });
        eventBus.subscribe("game_player_leave_nearby_area", ({ userId }) => {
            console.log("new player not nearby", userId);
            this.nearbyPlayers = this.nearbyPlayers.filter((e) => e !== userId);
        });
    },
};
