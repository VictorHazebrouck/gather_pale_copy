/**
 * @module
 * @ignore
 * @category PEER_JS
 */

import Peer from "peerjs";
import eventBus from "../../EventBus";

//@ts-ignore
const URL_PEERJS = import.meta.env.VITE_PEERJS_BACKEND_URL;
//@ts-ignore
const PATH_PEERJS = import.meta.env.VITE_PEER_SERVER_PATH;
//@ts-ignore
const IS_SECURE_PEERJS = import.meta.env.VITE_PEER_SERVER_IS_SECURE == "true" ? true : false;
//@ts-ignore
const PORT_PEERJS = import.meta.env.VITE_PEER_SERVER_PORT;

/**
 * Class to handle peer to peer connections
 *
 * @class
 * @category PEER_JS
 */
class PeerJS extends Peer {
    /** @param {string} userId */
    constructor(userId) {
        super(userId, {
            host: URL_PEERJS,
            path: PATH_PEERJS,
            secure: IS_SECURE_PEERJS,
            port: PORT_PEERJS,
        });
        this.myId = userId;
        this.init();
    }

    resetConnections() {
        Object.keys(this.connections).forEach((peerId) => {
            //@ts-ignore
            this.connections[peerId].forEach((conn) => {
                conn.close();
            });
        });
    }

    /**
     * @param {MediaStream} stream
     * @param {string[]} userIds
     */
    connectToManyByIds(stream, userIds) {
        for (let userId of userIds) {
            const call = this.call(userId, stream);

            call.on("stream", (userStream) => {
                eventBus.publish("peer_receive_media_stream", {
                    userIdCaller: call.peer,
                    stream: userStream,
                });
            });
        }
    }

    init() {
        this.on("open", () => {
            eventBus.publish("peer_successfull_initialization", undefined);
        });

        // succesfull access towebcam and audio
        eventBus.once("personal_media_stream_initialized", (stream) => {
            this.myStream = stream;

            this.myStream.addEventListener("addtrack", (data) => {
                //@ts-ignore
                const currentUserIds = data.detail.map((e) => e.userId);

                this.resetConnections();
                this.connectToManyByIds(stream, currentUserIds);
            });

            this.myStream.addEventListener("removetrack", (data) => {
                //@ts-ignore
                const currentUserIds = data.detail.map((e) => e.userId);

                this.resetConnections();
                this.connectToManyByIds(stream, currentUserIds);
            });
        });

        // when a new user tries to call us, handle it
        this.on("call", (call) => {
            call.answer(this.myStream);

            console.log("accepting call request...");

            call.on("stream", (stream) => {
                eventBus.publish("peer_receive_media_stream", {
                    userIdCaller: call.peer,
                    stream: stream,
                });
            });

            call.on("close", () => {
                console.log("call closed");
            });
        });

        // when other player sends us a call request, initiate a peerjs connection
        eventBus.subscribe("peer_initiate_call_request", ({ userIdReceiver }) => {
            if (!this.myStream) {
                return console.log("cannot call without video sharing");
            }

            console.log("initiating call request...");

            const call = this.call(userIdReceiver, this.myStream);

            call.on("stream", (userStream) => {
                eventBus.publish("peer_receive_media_stream", {
                    userIdCaller: call.peer,
                    stream: userStream,
                });
            });
        });
    }
}

export default PeerJS;
