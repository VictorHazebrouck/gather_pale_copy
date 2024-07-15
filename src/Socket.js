/**
 * @module
 * @ignore
 */
import { io } from "socket.io-client";
import eventBus from "./EventBus";

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
     * Which will in turn get published to the eventBus
     *
     * @method
     */
    initReceivers() {
        this.socket.on("newPlayerConnected", (data) => {
            eventBus.publish("newPlayerConnected", data);
        });
        this.socket.on("connectionData", (data) => {
            eventBus.publish("connectionData", data);
        });
        this.socket.on("newPlayerMove", (data) => {
            eventBus.publish("newPlayerMove", data);
        });
        this.socket.on("playerDisconnected", (data) => {
            eventBus.publish("playerDisconnected", data);
        });
        this.socket.on("chatMessageReceived", (data) => {
            eventBus.publish("chatMessageReceived", data);
        });
    }

    /**
     * Initialize capture of events sent by the eventBus,
     * Which will in turn get published to the server
     *
     * @method
     */
    initEmiters() {
        eventBus.subscribe("sendChatMessage", (data) => {
            this.socket.emit("chatMessage", data);
        });
        eventBus.subscribe("move", (data) => {
            this.socket.emit("move", data);
        });
        eventBus.subscribe("nameChanged", (data) => {
            this.socket.emit("nameChanged", data);
        });
    }
}

export default Socket;
