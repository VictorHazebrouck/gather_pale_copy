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
 */

/**
 * @typedef {object} UserStore
 * @property {string} userName - Persisted username
 * @property {string} userId - Persisted user ID
 * @property {number} lastPositionY - Persisted last Y position
 * @property {number} lastPositionX - Persisted last X position
 */

/**
 * @typedef {object} ChatStore
 * @property {Room[]} rooms - Array of rooms
 * @property {number} selectedRoom - Index of the selected room
 * @property {Function} backToRoomSelection - Function to go back to room selection
 * @property {function(number): void} goToRoom - Function to go to a specific room by index
 * @property {function(PlayerData): void} newRoom - Function to create a new room
 * @property {function(string): void} sendMessage - Function to send a message
 * @property {function(): Promise<void>} init - Function to initialize the store
 * @property {boolean} _isInit - Flag to indicate if the store is initialized
 */

/**
 * Represents a configuration object for managing side panels and components.
 *
 * @typedef {object} UtilsStore
 * @property {boolean} isSidePannelVisible - Indicates if the side panel is visible.
 * @property {string} sidePannerSelected - The currently selected panel ('chat', 'settings', etc.).
 * @property {function(string): Promise<string>} Component - Asynchronously fetches and returns HTML content from a specified URL.
 * @property {function(string): Promise<void>} outterSwapComponent - Asynchronously fetches HTML content and replaces the outer HTML of the current element.
 * @property {function(): void} closeSidePannel - Closes the side panel by setting `isSidePanelVisible` to false.
 * @property {function(string): void} openSidePannel - Opens the side panel and sets the selected panel.
 * @property {function(): void} resetDB - Function to reset the database
 * @property {function(): void} changeName - Function to add new name
 */

/**
 * Represents a card manager configuration object.
 *
 * @typedef {object} PlayerCardStore
 * @property {number} x - The x-coordinate position of the card relative to the game canvas.
 * @property {number} y - The y-coordinate position of the card relative to the game canvas.
 * @property {string} userId - The user ID associated with the card.
 * @property {string} userName - The user name associated with the card.
 * @property {boolean} isCardVisible - Indicates if the card is visible.
 * @property {function(PlayerData, Coordinates): void} showCard - Shows the card at a specified position with user details.
 * @property {function(): void} hideCard - Hides the card.
 * @property {function(): void} sendMessage - Sends a message using user details via Alpine store.
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
 * Represents the movement actions a player can do
 *
 * @typedef {("up" | "down" | "left" | "right" | "stop")} Direction
 */

/**
 * Represents the participants data
 *
 * @typedef {object} ParticipantsStore
 * @property {string[]} participants - list of participants
 * @property {boolean} _isInit - flag to ensure init is being called only once
 * @property {function():void} init - initialization function
 */

/**
 * @typedef {object} MoveInstructions
 * @property {string} userId - id from the movement initiator
 * @property {Direction} direction - direction in which the player wishes to move
 * @property {number} x - x coordinaates at the moment of emission
 * @property {number} y - y coordinaates at the moment of emission
 */
