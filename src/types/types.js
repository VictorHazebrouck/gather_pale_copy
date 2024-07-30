/**
 * @typedef {object} Message
 * @property {string} _id - The unique identifier for the message.
 * @property {string} sender - The name of the message sender.
 * @property {string} value - The content of the message.
 * @property {string} time - The time the message was sent.
 */

/**
 * @typedef {object} Room
 * @property {string} _id - The unique identifier for the room.
 * @property {string} userId - The ID of the user associated with the room.
 * @property {string} userName - The name of the user associated with the room.
 * @property {Message[]} messages - The list of messages in the room.
 */

/**
 * @typedef {object} User
 * @property {string} _id - The unique identifier for the user
 * @property {string} userName - The name of the user
 * @property {boolean} isConnected - connection status of the user
 */

/**
 * Represents unique player data shared with each Player
 *
 * @typedef {object} PlayerData
 * @property {string} userId - The unique ID of the player
 * @property {string} userName - The username of the player
 */

/**
 * Represents a coordinates object
 *
 * @typedef {object} Coordinates
 * @property {number} x - The x-coordinae fo the player
 * @property {number} y - The y-coordinae fo the player
 */

/**
 * @typedef {object} PlayerDataWithCoordinates
 * @property {string} userId - The unique ID of the player
 * @property {string} userName - The username of the player
 * @property {number} x - The x-coordinae fo the player
 * @property {number} y - The y-coordinae fo the player
 */

/**
 * Represents the movement actions a player can do
 *
 * @typedef {"up" | "down" | "left" | "right" | "stop"} Direction
 */

/**
 * @typedef {object} MoveInstructions
 * @property {string} userId - id from the movement initiator
 * @property {Direction} direction - direction in which the player wishes to move
 * @property {number} x - x coordinaates at the moment of emission
 * @property {number} y - y coordinaates at the moment of emission
 */

/**
 * @typedef {object} RemoteStream
 * @property {MediaStream | null} stream
 * @property {MediaStream | null} screenShare
 * @property {boolean} isSoundEnabled
 * @property {boolean} isVideoEnabled
 * @property {string} userId
 */
