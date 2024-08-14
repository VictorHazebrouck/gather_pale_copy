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

    init() {
        eventBus.once("personal_media_stream_initialized", (stream) => {
            this.myStream = stream;
        });

        // Successfull connection to peer server
        this.on("open", () => {
            eventBus.publish("peer_successfull_initialization", undefined);
        });

        // when a new user tries to call us, handle it
        this.on("call", (call) => {
            call.answer(this.myStream);
            console.log("accepting call request");

            call.on("stream", (stream) => {
                eventBus.publish("peer_receive_media_stream", {
                    userIdCaller: call.peer,
                    stream: stream,
                });
            });
        });

        // when other player sends us a call request, initiate a peerjs connection
        eventBus.subscribe("peer_receive_call_request", ({ userId }) => {
            if (!this.myStream) {
                console.log("cannot call without video sharing");
                return;
            }

            const call = this.call(userId, this.myStream);

            console.log("initiated call request");

            call.on("stream", (userStream) => {
                eventBus.publish("peer_receive_media_stream", {
                    userIdCaller: userId,
                    stream: userStream,
                });
            });
        });
    }
}

export default PeerJS;
