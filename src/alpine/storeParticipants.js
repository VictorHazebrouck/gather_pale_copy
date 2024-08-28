import eventBus from "../EventBus";

/** @type {ParticipantsStore} */
export default {
    participantsBase: [],
    participants: [],
    searchFilter: "",

    /** @param {User} player */
    handleClickParticipant(player) {
        //@ts-ignore represents the li node in which the function is being called
        const element = this.$el;
        const position = element.getBoundingClientRect();

        /** @type {PlayerClickEventData} */
        const obj = {
            playerInformation: {
                userId: player._id,
                userName: player.userName,
            },
            position: {
                x: position.x,
                y: position.y,
            },
        };
        eventBus.publish("game_player_clicked", obj);
    },
    searchUser(input = "") {
        this.searchFilter = input;
        this.participants = this.participantsBase.filter((e) =>
            e.userName.toLowerCase().includes(this.searchFilter.toLowerCase())
        );
    },

    _isInit: false,
    init() {
        if (this._isInit) {
            return;
        }
        this._isInit = true;

        eventBus.subscribe("DB_users_has_changed", (users) => {
            const _users = [...users];
            this.participantsBase = _users.sort((a, b) => a.userName.localeCompare(b.userName));
            this.participants = this.participantsBase.filter((e) =>
                e.userName.toLowerCase().includes(this.searchFilter.toLowerCase())
            );
            return;
        });

        eventBus.once("DB_users_init", (users) => {
            const _users = [...users];
            this.participantsBase = _users.sort((a, b) => a.userName.localeCompare(b.userName));
            this.participants = [...this.participantsBase];
            return;
        });
    },
};
