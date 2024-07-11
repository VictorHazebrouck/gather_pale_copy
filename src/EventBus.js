/** @module EventBus */

/**
 * List of all event names with their corresponding data to be passed around.
 * @typedef {Object} EventsList
 * @property {NewPlayerConnectedEventData} newPlayerConnected
 * @property {ConnectionDataEventData} connectionData
 * @property {NewPlayerMoveEventData} newPlayerMove
 * @property {PlayerDisconnectdEventData} playerDisconnected
 * @property {ChatMessageReceivedEventData} chatMessageReceived
 * @property {SendChatMessageEventData} sendChatMessage
 * @property {MoveEventData} move
 * @property {NameChangedEventData} nameChanged
 * @property {ANameHasChangedEventData} aNameHasChanged
 * @property  {PlayerClickEventData} playerClick
 */

/**
 * Event bus to handle events
 * @class
 *
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
     * @param {EventData} data - The callback function to handle the event.
     *
     * @see {EventsList}
     */
    publish(event, data) {
        if (!this._listeners[event]) return;

        this._listeners[event].forEach((listener) => listener(data));
    }
}

const eventBus = new EventBus();

export default eventBus;

/**
 * @typedef {Object} SendChatMessageEventData
 * @property {string} userIdReceiver - The user ID of the message receiver.
 * @property {string} userNameReceiver - The username of the message receiver.
 * @property {string} userIdSender - The user ID of the message sender.
 * @property {string} userNameSender - The username of the message sender.
 * @property {string} value - The message content.
 * @property {string} time - The time when the message was sent, formatted as a string.
 */

/**
 * @typedef {Object} ChatMessageReceivedEventData - The data object containing message details.
 * @property {string} userIdSender - The user ID of the message sender.
 * @property {string} userNameSender - The username of the message sender.
 * @property {string} value - The message content.
 * @property {string} time - The time when the message was sent.
 */

/**
 * @typedef {Object} MoveEventData
 * @property {string} userId - id from the movement initiator
 * @property {Direction} direction - direction in which the player wishes to move
 * @property {number} x - x coordinaates at the moment of emission
 * @property {number} y - y coordinaates at the moment of emission
 */

/**
 * @typedef {Object} NewPlayerMoveEventData
 * @property {string} userId - id from the movement initiator
 * @property {Direction} direction - direction in which the player wishes to move
 * @property {number} x - x coordinaates at the moment of emission
 * @property {number} y - y coordinaates at the moment of emission
 */

/** @typedef {PlayerDataWithCoordinates} NewPlayerConnectedEventData*/

/**
 * @typedef {Object} ConnectionDataEventData
 * @property {PlayerDataWithCoordinates[]} Players
 */

/**
 * @typedef {Object} PlayerDisconnectdEventData
 * @property {string} userId
 */

/**
 * @typedef {Object} NameChangedEventData
 * @property {string} newName
 */

/**
 * @typedef {Object} ANameHasChangedEventData
 * @property {string} newName
 * @property {string} userId
 */

/**
 * @typedef {Object} PlayerClickEventData
 * @property {PlayerData} playerInformation
 * @property {Coordinates} position
 */
