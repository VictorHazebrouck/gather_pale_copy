/**
 * @module
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
}

const eventBus = new EventBus();

export default eventBus;

/**
 * List of all event names with their corresponding data to be passed around.
 *
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
 * @typedef {Object} SendChatMessageEventData
 * @property {string} userIdReceiver - The user ID of the message receiver.
 * @property {string} userNameReceiver - The username of the message receiver.
 * @property {string} userIdSender - The user ID of the message sender.
 * @property {string} userNameSender - The username of the message sender.
 * @property {string} value - The message content.
 * @property {string} time - The time when the message was sent, formatted as a string.
 *
 * @event sendChatMessage
 * @type {SendChatMessageEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} ChatMessageReceivedEventData - The data object containing message details.
 * @property {string} userIdSender - The user ID of the message sender.
 * @property {string} userNameSender - The username of the message sender.
 * @property {string} value - The message content.
 * @property {string} time - The time when the message was sent.
 *
 * @event chatMessageReceived
 * @type {SendChatMessageEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} MoveEventData
 * @property {string} userId - id from the movement initiator
 * @property {Direction} direction - direction in which the player wishes to move
 * @property {number} x - x coordinaates at the moment of emission
 * @property {number} y - y coordinaates at the moment of emission
 *
 * @event move
 * @type {MoveEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} NewPlayerMoveEventData
 * @property {string} userId - id from the movement initiator
 * @property {Direction} direction - direction in which the player wishes to move
 * @property {number} x - x coordinaates at the moment of emission
 * @property {number} y - y coordinaates at the moment of emission
 *
 * @event newPlayerMove
 * @type {NewPlayerMoveEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {PlayerDataWithCoordinates} NewPlayerConnectedEventData
 *
 * @event newPlayerConnected
 * @type {NewPlayerConnectedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} ConnectionDataEventData
 * @property {PlayerDataWithCoordinates[]} Players
 *
 * @event connectionData
 * @type {ConnectionDataEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} PlayerDisconnectdEventData
 * @property {string} userId
 *
 * @event playerDisconnected
 * @type {PlayerDisconnectdEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} NameChangedEventData
 * @property {string} newName
 *
 * @event nameChanged
 * @type {NameChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} ANameHasChangedEventData
 * @property {string} newName
 * @property {string} userId
 *
 * @event aNameHasChanged
 * @type {ANameHasChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} PlayerClickEventData
 * @property {PlayerData} playerInformation
 * @property {Coordinates} position
 *
 * @event playerClick
 * @type {PlayerClickEventData}
 * @category EVENT_BUS
 */
