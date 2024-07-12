/** @ignore @module */
import { io } from "socket.io-client";
import EventBus from "./EventBus";

/**
 * Socket manager class
 *
 * @category SOCKET
 */
class Socket {
    /**
     * Init socket instance with persisted user Data
     *
     * @param {UserStore} userData - init socket with Persisted User data
     */
    constructor(userData) {
        this.socket = io("http://localhost:3015", { query: userData });

        this.initReceivers();
        this.initEmiters();
    }

    /**
     * Initialize capture of socket events sent by the server,
     * Which will in turn get published to the EventBus
     *
     * @method
     */
    initReceivers() {
        this.socket.on("newPlayerConnected", (data) => {
            EventBus.publish("newPlayerConnected", data);
        });
        this.socket.on("connectionData", (data) => {
            EventBus.publish("connectionData", data);
        });
        this.socket.on("newPlayerMove", (data) => {
            EventBus.publish("newPlayerMove", data);
        });
        this.socket.on("playerDisconnected", (data) => {
            EventBus.publish("playerDisconnected", data);
        });
        this.socket.on("chatMessageReceived", (data) => {
            EventBus.publish("chatMessageReceived", data);
        });
    }

    /**
     * Initialize capture of events sent by the EventBus,
     * Which will in turn get published to the server
     *
     * @method
     */
    initEmiters() {
        EventBus.subscribe("sendChatMessage", (data) => {
            this.socket.emit("chatMessage", data);
        });
        EventBus.subscribe("move", (data) => {
            this.socket.emit("move", data);
        });
        EventBus.subscribe("nameChanged", (data) => {
            this.socket.emit("nameChanged", data);
        });
    }
}

export default Socket;
