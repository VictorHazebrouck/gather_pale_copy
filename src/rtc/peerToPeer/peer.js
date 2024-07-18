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

        /**
         * @typedef {object} Stream
         * @property {string} userId
         * @property {MediaStream} stream
         */

        /** @type {Stream[]} */
        this.streams = [];

        this.initializePersonalVideoStream();
        this.init();
    }

    /**
     * Adds a stream to the streams array
     *
     * @param {string} userId
     * @param {MediaStream} stream
     */
    addStream(userId, stream) {
        if (!this.streams.find((s) => s.userId === userId) && this.myId !== userId) {
            this.streams.push({ userId, stream });
        }
    }

    /**
     * Removes a stream from the streams array
     *
     * @param {string} userId
     */
    removeStream(userId) {
        this.streams = this.streams.filter((s) => s.userId !== userId);
    }

    /**
     * Handle personnal video stream authoriation request
     */
    async initializePersonalVideoStream() {
        try {
            // Request access to the camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.myStream = stream;
        } catch (error) {
            alert("Error accessing media devices, please allow access");
            console.error("Error accessing media devices:", error);
        }
    }

    async init() {
        // On successfull connection to peer server, initiate call request
        this.on("open", (id) => {
            eventBus.publish("peer_initiate_call_request", { userId: id });
        });

        // when a new user tries to call us, handle it
        this.on("call", (call) => {
            call.answer(this.myStream);
            call.on("stream", (videoStream) => {
                this.addStream(call.peer, videoStream);
            });

            call.on("close", () => {
                this.removeStream(call.peer);
            });
        });

        // when other player sends us a call request, initiate a peerjs connection
        eventBus.subscribe("peer_receive_call_request", ({ userId }) => {
            if (!this.myStream) {
                return;
            }

            const call = this.call(userId, this.myStream);

            call.on("stream", (userStream) => {
                this.addStream(userId, userStream);
            });

            call.on("close", () => {
                this.removeStream(userId);
            });
        });
    }
}

export default PeerJS;
