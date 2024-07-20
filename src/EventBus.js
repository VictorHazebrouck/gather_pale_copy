/**
 * @module
 * @ignore
 */

/**
 * Centralized events handler
 *
 * @category EVENT_BUS
 */
class EventBus {
    constructor() {
        /** @type {Record<string, Array<function>>} */
        this._listeners = {};
    }

    /**
     * Subscribe a callback function to an event.
     *
     * @template {keyof EventsList} EventName
     * @template {EventsList[EventName]} EventData
     *
     * @param {EventName} event - The event name.
     * @param {function(EventData): void} listener - The callback function to handle the event.
     */
    subscribe(event, listener) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(listener);
    }

    /**
     * Unsubscribe a callback function from an event.
     *
     * @template {keyof EventsList} EventName
     * @template {EventsList[EventName]} EventData
     *
     * @param {EventName} event - The event name.
     * @param {function(EventData): void} listener - The callback function to handle the event.
     */
    unsubscribe(event, listener) {
        if (!this._listeners[event]) {
            return;
        }
        this._listeners[event] = this._listeners[event].filter((l) => l !== listener);
    }

    /**
     * Publish an event.
     *
     * @template {keyof EventsList} EventName
     * @template {EventsList[EventName]} EventData
     *
     * @param {EventName} event - The event name.
     * @param {EventData} data - The data to be passed on through the event.
     */
    publish(event, data) {
        if (!this._listeners[event]) return;

        this._listeners[event].forEach((listener) => listener(data));
    }

    /**
     * Subscribes a callback function to an event only once.
     *
     * @template {keyof EventsList} EventName
     * @template {EventsList[EventName]} EventData
     *
     * @param {EventName} event - The event name.
     * @param {function(EventData): void} listener - The callback function to handle the event.
     */
    once(event, listener) {
        /** @param {EventData} data */
        const wrapper = (data) => {
            listener(data);
            this.unsubscribe(event, wrapper);
        };

        this.subscribe(event, wrapper);
    }
}

const eventBus = new EventBus();

export default eventBus;
