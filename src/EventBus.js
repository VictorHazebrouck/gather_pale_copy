import * as T from "./types/eventBus"

/** @type {T.EventBus} */
const EventBus = {
    _listeners: {},

    subscribe(event, listener) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(listener);
    },

    unsubscribe(event, listener) {
        if (!this._listeners[event]) {
            return;
        }
        this._listeners[event] = this._listeners[event].filter((l) => l !== listener);
    },

    publish(event, data) {
        if (!this._listeners[event]) return;

        this._listeners[event].forEach((listener) => listener(data));
    },
};

export default EventBus;
