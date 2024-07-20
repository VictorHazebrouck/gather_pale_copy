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
        this.on("open", () => {
            console.log("connected to peer server!");
        });

        // when a new user tries to call us, handle it
        this.on("call", (call) => {
            call.answer(this.myStream);
            console.log("accepting call request");

            call.on("stream", (videoStream) => {
                eventBus.publish("peer_receive_media_stream", {
                    userIdCaller: call.peer,
                    stream: videoStream,
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

        eventBus.subscribe("mute_video", (/**@type {boolean}*/ bool) => {
            console.log("miting...");
            this.myStream?.getVideoTracks().forEach((track) => (track.enabled = bool));
        });
        eventBus.subscribe("mute_audio", (/**@type {boolean}*/ bool) => {
            console.log("miting...");
            this.myStream?.getAudioTracks().forEach((track) => (track.enabled = bool));
        });
    }
}

export default PeerJS;
