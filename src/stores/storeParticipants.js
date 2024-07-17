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
            this.participants = users;
        });
    },
};
