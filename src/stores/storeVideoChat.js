export default {
    streams: [],
    /** @type {MediaStream | null} */
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
        if (!this._isInit) {
            return;
        } else {
            this._isInit = true;
        }
        
        try {
            // Request access to the camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.myStream = stream;
        } catch (/** @type {any}*/ error) {
            alert("Error accessing media devices, please allow access");
            console.error("Error accessing media devices:", error);
        }
    },
};
