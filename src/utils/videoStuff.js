/**
 *
 * @returns {Promise<[MediaStreamTrack, null] | [null, Error]>}
 */
async function requestScreencastVideoTrack() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false,
        });

        const track = stream.getVideoTracks()[0];
        track.contentHint = "detail";

        return [track, null];
    } catch (error) {
        return [null, new Error(error)];
    }
}

/**
 *
 * @returns {Promise<[MediaStreamTrack, MediaStreamTrack, null] | [null, null, Error]>}
 */
async function requestWebcamAndAudioTracks() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.enabled = false;
        videoTrack.contentHint = "motion";

        const audioTrack = stream.getAudioTracks()[0];
        audioTrack.enabled = false;
        audioTrack.contentHint = "speech";

        return [videoTrack, audioTrack, null];
    } catch (error) {
        return [null, null, new Error(error)];
    }
}
/**
 *
 * @param {MediaStream} stream
 * @param {boolean} muteState
 * @returns {Error | null}
 */
function muteWebcamTrack(stream, muteState) {
    const track = stream.getVideoTracks().find((stream) => stream.contentHint === "motion");

    if (!track) {
        return new Error("could't find webcam track");
    }

    track.enabled = muteState;
    return null;
}

/**
 *
 * @param {MediaStream} stream
 * @param {boolean} muteState
 * @returns {Error | null}
 */
function muteAudioTrack(stream, muteState) {
    const track = stream.getAudioTracks()[0];

    if (!track) {
        return new Error("could't find webcam track");
    }

    track.enabled = muteState;
    return null;
}

export {
    requestScreencastVideoTrack,
    requestWebcamAndAudioTracks,
    muteWebcamTrack,
    muteAudioTrack,
};
