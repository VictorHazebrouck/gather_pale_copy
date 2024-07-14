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

        EventBus.subscribe("DBUsersHasChanged", (users) => {
            this.participants = users;
        });
    },
};
