/**
 * @module
 * @ignore
 * @category PEER_JS
 */

import Peer from "peerjs";
import eventBus from "../../EventBus";

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
            host: "localhost",
            port: 3016,
            path: "/peerjs",
            secure: false,
        });
        this.myId = userId;
        this.myStream = undefined;
        this.init();
    }

    init() {
        eventBus.once("personal_media_stream_initialized", (stream) => {
            this.myStream = stream;
        });

        // Successfull connection to peer server
        this.on("open", () => {
            console.log("successfully connected to peer server!");
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
