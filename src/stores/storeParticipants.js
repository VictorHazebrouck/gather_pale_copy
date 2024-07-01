import { newUserDB } from "../db/users";
import SocketManager from "../sockets/socketManager";

/** @type {ParticipantsStore} */
export default {
    participants: [],

    _isInit: false,
    init() {
        if (this._isInit) {
            return;
        }

        SocketManager.socket?.on("connectionData", (data) => {
            /** @type {Array<PlayerData & Coordinates>} */
            const players = data.Players;

            for (const {userId, userName} of players) {
                newUserDB(userId, userName);
            }
        });
        SocketManager.socket?.on(
            "newPlayerConnected",
            (/** @type {PlayerData & Coordinates} */ data) => {
                console.log("HELLO FROM NEW PLAYER CONNECTED", data);
            }
        );

        this._isInit = true;
    },
};
