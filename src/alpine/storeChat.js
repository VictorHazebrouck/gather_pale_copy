import Alpine from "alpinejs";
import EventBus from "../EventBus";
import { v4 as uuidv4 } from "uuid";

/** @type {ChatStore} */
export default {
    rooms: [],
    selectedRoom: -1,

    backToRoomSelection() {
        this.selectedRoom = -1;
    },
    goToRoom(index = -1) {
        this.selectedRoom = index;
    },
    newRoom({ userId, userName }) {
        /** If room already exists, open current one */
        const index = this.rooms.findIndex((e) => e.userId === userId);
        if (index !== -1) {
            return this.goToRoom(index);
        }

        /** @type {Room} */
        const room = {
            _id: uuidv4(),
            userId: userId,
            userName: userName,
            messages: [],
        };

        /** Else create a new temp room until first message sent*/
        this.rooms.push(room);

        this.goToRoom(this.rooms.length - 1);
    },
    sendMessage(msg = "") {
        if (!msg) {
            return;
        }

        EventBus.publish("initiate_chat_message", {
            /** Send message to backend, will transmit it only to him by his userId */
            roomId: this.rooms[this.selectedRoom]._id,
            userIdReceiver: this.rooms[this.selectedRoom].userId,
            userNameReceiver: this.rooms[this.selectedRoom].userName,
            userIdSender: Alpine.store("user").userId,
            userNameSender: Alpine.store("user").userName,
            value: msg,
            time: formatNow(),
        });

        // @ts-ignore $data represents the data in the context in which the fn in being called
        this.$data.input = "";
    },
    async init() {
        /** Ensures init is being called only once, called by alpine when binding store to x-data */
        if (this._isInit) {
            return;
        }
        this._isInit = true;

        EventBus.once("DB_rooms_init", (data) => {
            this.rooms = data;
        });

        EventBus.subscribe("DB_rooms_has_changed", (data) => {
            this.rooms = data;
        });
    },
    _isInit: false,
};

/**
 * Fn to get now date formatted as wished
 *
 * @returns {string} - Returns the properly formated date
 */
function formatNow() {
    return new Date().getHours() + ":" + new Date().getMinutes();
}
