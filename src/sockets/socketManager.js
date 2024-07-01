import { io } from "socket.io-client";

/**
 * Represents a singleton class for managing Socket.IO connections.
 *
 * @class SocketManager
 */
class SocketManager {
    /** @type {SocketManager} */
    static _instance;

    /** ensures only one instance of the class is running */
    constructor() {
        if (SocketManager._instance) {
            return SocketManager._instance;
        }
        SocketManager._instance = this;
    }

    /**
     * Gets the running socket instance, ensuring it is initialized
     *
     * @returns {import("socket.io-client").Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap>}
     *      - currated socket instance
     * @throws Will throw an errorr in case the socket instance it not properly initialized
     */
    getSocket() {
        if (!this.socket) {
            throw new Error("Socket initialization failed !");
        }

        return this.socket;
    }

    /**
     * Init socket instance with persisted user Data
     *
     * @param {UserStore} userData - init socket with Persisted User data
     * @returns {void} - returns socket instance
     */
    init(userData) {
        /** Ensures only one and always the same instance of a socket is running */
        if (this.socket) {
            return;
        }
        /** Allows for passing in data to the 'connect' & each subsequent event via query */
        this.socket = io("http://localhost:3015", { query: userData });
    }
}

const instance = new SocketManager();

export default instance;
