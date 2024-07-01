import Alpine from "alpinejs";
import { newUserDB, getUsersDB } from "../db/users";
import SocketManager from "../sockets/socketManager";
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

        SocketManager.socket?.on("connectionData", (data) => {
            /** @type {Array<PlayerData & Coordinates>} */
            const players = data.Players;

            for (const { userId, userName } of players) {
                this.syncNames(userId, userName);
            }
        });
        SocketManager.socket?.on("newPlayerConnected", (data) => {
            const { userId = "", userName = "" } = data;
            this.syncNames(userId, userName);
        });
        SocketManager.socket?.on("aNameHasChanged", (data) => {
            const { userId = "", newName = "" } = data;
            this.syncNames(userId, newName);
        });
    },
    async syncNames(userId, newName) {
        if (!userId || !newName) {
            return;
        }

        await newUserDB(userId, newName);
        Alpine.store("chat").rooms = await getRoomsDb();
        this.participants = await getUsersDB()
    },
};
