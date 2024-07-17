import Peer from "peerjs";
import Alpine from "alpinejs";
window.Alpine = Alpine;
import { io } from "socket.io-client";

const socket = io("http://localhost:3015");
const roomId = "zinzizn";

const peer = new Peer(undefined, {
    host: "localhost",
    port: 3016,
    path: "/peerjs",
    secure: false, // Set to true if using HTTPS
});

Alpine.store("videoStreams", {
    streams: [],
    myStream: null,
    myId: null,

    addStream(userId, stream) {
        if (!this.streams.find((s) => s.userId === userId) && this.myId !== userId) {
            this.streams.push({ userId, stream });
        }
    },
    removeStream(userId) {
        this.streams = this.streams.filter((s) => s.userId !== userId);
    },
    _isInit: false,
    async init() {
        if (this._isInit) {
            return;
        } else {
            this._isInit = true;
        }

        peer.on("open", (id) => {
            this.myId = id;
            socket.emit("userJoinVideo", { roomId: roomId, userId: id });
        });

        peer.on("call", (call) => {
            call.answer(this.myStream);
            call.on("stream", (videoStream) => {
                this.addStream(call.peer, videoStream);
            });

            call.on("close", () => {
                this.removeStream(call.peer);
            });
        });

        socket.on("newUserJoin", ({ userId }) => {
            const call = peer.call(userId, this.myStream);

            call.on("stream", (userStream) => {
                this.addStream(userId, userStream);
            });

            call.on("close", () => {
                this.removeStream(userId);
            });
        });

        try {
            // Request access to the camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.myStream = stream;
        } catch (error) {
            alert("Error accessing media devices, please allow access");
            console.error("Error accessing media devices:", error);

            if (error.name === "NotAllowedError") {
                console.error("Permissions denied. Please allow access to the camera and microphone.");
            } else if (error.name === "NotFoundError") {
                console.error("No media devices found. Ensure your camera and microphone are connected and enabled.");
            } else {
                console.error("An unknown error occurred while accessing media devices.");
            }
        }


    },
});

Alpine.start();
