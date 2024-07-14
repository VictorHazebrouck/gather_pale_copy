import "../types/types";
import Alpine from "alpinejs";
import EventBus from "../EventBus";
import { v4 as uuidv4 } from "uuid";
import { newChatDb, newRoomDb, getRoomsDb } from "../db/collectionRooms";

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
    newRoom({ userId = "", userName = "" }) {
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

        /** Else create a new room && save it to db*/
        this.rooms.push(room);
        newRoomDb(room);

        this.goToRoom(this.rooms.length - 1);
    },
    sendMessage(msg = "") {
        if (!msg) {
            return;
        }

        EventBus.publish("sendChatMessage", {
            /** Send message to backend, will transmit it only to him by his userId */
            userIdReceiver: this.rooms[this.selectedRoom].userId,
            userNameReceiver: this.rooms[this.selectedRoom].userName,
            userIdSender: Alpine.store("user").userId,
            userNameSender: Alpine.store("user").userName,
            value: msg,
            time: formatNow(),
        });

        /** @type {Message} */
        const message = {
            _id: uuidv4(),
            sender: Alpine.store("user").userId,
            value: msg,
            time: formatNow(),
        };
        /** Add the message to your own chat && save it to db*/
        this.rooms[this.selectedRoom].messages.push(message);
        newChatDb(this.rooms[this.selectedRoom]._id, message);

        // @ts-ignore $data represents the data in the context in which the fn in being called
        this.$data.input = "";
    },
    async init() {
        /** Ensures init is being called only once, called by alpine when binding store to x-data */
        if (this._isInit) {
            return;
        }
        this._isInit = true;

        /** Get rooms from idb */
        this.rooms = await getRoomsDb();

        /** init chat message socket */
        EventBus.subscribe("chatMessageReceived", (data) => {
            const { userIdSender, userNameSender, value, time } = data;

            const index = this.rooms.findIndex((e) => e.userId === userIdSender);

            /** @type {Message} */
            const message = {
                _id: uuidv4(),
                sender: userIdSender,
                value: value,
                time: time,
            };

            /** If room already exists, open current one */
            if (index !== -1) {
                /** Push message to your room && save it to db*/
                this.rooms[index].messages.push(message);
                newChatDb(this.rooms[index]._id, message);

                return this.goToRoom(index);
            }

            /** @type {Room} */
            const room = {
                _id: uuidv4(),
                userId: userIdSender,
                userName: userNameSender,
                messages: [message],
            };

            /** Else create a new room containing the new message && save it to db */
            this.rooms.push(room);
            newRoomDb(room);

            this.goToRoom(this.rooms.length - 1);
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
