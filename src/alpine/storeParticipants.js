import eventBus from "../EventBus";

/** @type {ParticipantsStore} */
export default {
    participants: [],

    /** @param {User} player */
    clickPlayerCard(player) {
        console.log("hahahahah");
    },

    _isInit: false,
    init() {
        if (this._isInit) {
            return;
        }
        this._isInit = true;

        eventBus.subscribe("DB_users_has_changed", (users) => {
            const _users = [...users];
            this.participants = _users.sort((a, b) => (a.isConnected ? -1 : 1));
        });

        eventBus.once("DB_users_init", (users) => {
            const _users = [...users];
            this.participants = _users.sort((a, b) => (a.isConnected ? -1 : 1));
        });
    },
};
