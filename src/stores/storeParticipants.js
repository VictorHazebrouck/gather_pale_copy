import Alpine from "alpinejs";
import { newUserDB, getUsersDB, disconnectUser } from "../db/users";
import EventBus from "../EventBus";
import { getRoomsDb } from "../db/chatRooms";

/** @type {ParticipantsStore} */
export default {
    participants: [],

    _isInit: false,
    init() {
        if (this._isInit) {
            return;
        }
        this._isInit = true;

        EventBus.subscribe("connectionData", (data) => {
            /** @type {PlayerDataWithCoordinates[]} */
            const players = data.Players;

            for (const { userId, userName } of players) {
                this.syncNames(userId, userName);
            }
        });
        EventBus.subscribe("newPlayerConnected", (data) => {
            const { userId = "", userName = "" } = data;
            this.syncNames(userId, userName);
        });
        EventBus.subscribe("aNameHasChanged", (data) => {
            const { userId = "", newName = "" } = data;
            this.syncNames(userId, newName);
        });
        EventBus.subscribe("playerDisconnected", ({ userId }) => {
            this.disconnectUser(userId);
        });
    },
    async syncNames(userId, newName) {
        if (!userId || !newName) {
            return;
        }

        await newUserDB(userId, newName);
        Alpine.store("chat").rooms = await getRoomsDb();
        this.participants = await getUsersDB();
    },
    async disconnectUser(userId) {
        await disconnectUser(userId);
    },
};
