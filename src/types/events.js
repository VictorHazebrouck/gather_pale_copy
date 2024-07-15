/**
 * @module
 * @category EVENT_BUS
 * @ignore
 */

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
 * @property  {DBUsersHasChangedEventData} DBUsersHasChanged
 * @property  {DBRoomsHasChangedEventData} DBRoomsHasChanged
 * @property  {DBRoomsInit} DBRoomsInit
 */

/**
 * @typedef {User[]} DBUsersHasChangedEventData
 *
 * @event DBUsersHasChanged
 * @type {DBUsersHasChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Room[]} DBRoomsHasChangedEventData
 *
 * @event DBRoomsHasChanged
 * @type {DBRoomsHasChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Room[]} DBRoomsInit
 *
 * @event DBRoomsHasChanged
 * @type {DBRoomsHasChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} SendChatMessageEventData
 * @property {string} roomId - The room ID.
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
