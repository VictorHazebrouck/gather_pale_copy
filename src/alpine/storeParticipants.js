import EventBus from "../EventBus";

/** @type {ParticipantsStore} */
export default {
    participants: [],

    _isInit: false,
    init() {
        if (this._isInit) {
            return;
        }
        this._isInit = true;

        EventBus.subscribe("DB_users_has_changed", (users) => {
            const _users = [...users];
            this.participants = _users.sort((a, b) => (a.isConnected ? -1 : 1));
        });

        EventBus.once("DB_users_init", (users) => {
            const _users = [...users];
            this.participants = _users.sort((a, b) => (a.isConnected ? -1 : 1));
        });
    },
};
