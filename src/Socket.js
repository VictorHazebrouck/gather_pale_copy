import { io } from "socket.io-client";
import EventBus from "./EventBus";

/**
 * Represents a singleton class for managing Socket.IO connections.
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

    initEmiters() {
        EventBus.subscribe("sendChatMessage", (data) => {
            this.socket.emit("chatMessage");
        });
        EventBus.subscribe("move", (data) => {
            this.socket.emit("move");
        });
        EventBus.subscribe("nameChanged", (data) => {
            this.socket.emit("nameChanged");
        });
    }
}

export default Socket;
