/**
 * @module
 * @ignore
 */
import { io } from "socket.io-client";
import eventBus from "./EventBus";

//@ts-ignore
const URL_SOCKETIO = import.meta.env.VITE_SOCKETIO_BACKEND_URL;
//@ts-ignore
const PATH_SOCKETIO = import.meta.env.VITE_SOCKETIO_PATH;

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
        this.socket = io(URL_SOCKETIO, { path: PATH_SOCKETIO, query: userData });

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
        this.socket.on("connect", () => {
            eventBus.publish("socket_successfull_initialization", undefined);
        });

        this.socket.on("newPlayerConnected", (data) => {
            eventBus.publish("new_player_connected", data);
        });
        this.socket.on("connectionData", (data) => {
            eventBus.publish("receive_initial_gamestate", data);
        });
        this.socket.on("newPlayerMove", (data) => {
            eventBus.publish("receive_move_instructions", data);
        });
        this.socket.on("playerDisconnected", (data) => {
            eventBus.publish("player_disconnected", data);
        });
        this.socket.on("chatMessageReceived", (data) => {
            eventBus.publish("receive_chat_message", data);
        });
        // obsolete
        // this.socket.on("newUserJoin", (data) => {
        //     eventBus.publish("peer_receive_call_request", data);
        // });
        this.socket.on("aNameHasChanged", (data) => {
            eventBus.publish("receive_username_change", data);
        });
        this.socket.on("receive_video_mute_change", (data) => {
            eventBus.publish("receive_video_mute_change", data);
        });
        this.socket.on("receive_audio_mute_change", (data) => {
            eventBus.publish("receive_audio_mute_change", data);
        });
    }

    /**
     * Initialize capture of events sent by the eventBus,
     * Which will in turn get published to the server
     *
     * @method
     */
    initEmiters() {
        eventBus.subscribe("initiate_chat_message", (data) => {
            this.socket.emit("chatMessage", data);
        });
        eventBus.subscribe("initiate_move_instructions", (data) => {
            this.socket.emit("move", data);
        });
        eventBus.subscribe("initiate_username_change", (data) => {
            this.socket.emit("nameChanged", data);
        });
        // obsolete
        // eventBus.subscribe("peer_initiate_call_request", (data) => {
        //     this.socket.emit("userJoinVideo", data);
        // });
        eventBus.subscribe("initiate_video_mute_change", (data) => {
            this.socket.emit("initiate_video_mute_change", data);
        });
        eventBus.subscribe("initiate_audio_mute_change", (data) => {
            this.socket.emit("initiate_audio_mute_change", data);
        });
    }
}

export default Socket;
