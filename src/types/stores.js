/**
 * @module
 * @category STORES
 */

/**
 * Represents the participants data
 *
 * @typedef {object} ParticipantsStore
 * @property {function(User):void} handleClickParticipant
 * @property {string} searchFilter - value of search input
 * @property {User[]} participants - list of participants filtered via search input
 * @property {User[]} participantsBase - base list of participants
 * @property {function(string):void} searchUser - search user by name
 * @property {boolean} _isInit - flag to ensure init is being called only once
 * @property {function():void} init - initialization function
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
 * @property {(function(any): void)} showCard - Shows the card at a specified position with user details.
 * @property {function(): void} hideCard - Hides the card.
 * @property {function(): void} sendMessage - Sends a message using user details via Alpine store.
 * @property {function(): void} init - Sends a message using user details via Alpine store.
 */

/**
 * Represents a configuration object for managing side panels and components.
 *
 * @typedef {object} UtilsStore
 * @property {boolean} isSidePannelVisible - Indicates if the side panel is visible.
 * @property {string} sidePannerSelected - The currently selected panel ('chat', 'settings', etc.).
 * @property {function(): void} closeSidePannel - Closes the side panel by setting `isSidePanelVisible` to false.
 * @property {function(string): void} openSidePannel - Opens the side panel and sets the selected panel.
 * @property {function(): void} resetDB - Function to reset the database
 * @property {function(): void} changeName - Function to add new name
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
 * @typedef {object} UserStore
 * @property {string} userName - Persisted username
 * @property {string} userId - Persisted user ID
 * @property {number} lastPositionY - Persisted last Y position
 * @property {number} lastPositionX - Persisted last X position
 */

/**
 * @typedef {object} VideoChatStore
 * @property {RemoteStream[]} nearbyPlayers - list of remote streams of nearby players
 * @property {MediaStream} myStream - my current media stream
 * @property {MediaStream | null} myScreenCast - my current media stream
 * @property {boolean} isMySoundEnabled - my current sound sharing state
 * @property {boolean} isMyVideoEnabled - my current video charing state
 * @property {boolean} isMyScreenshareEnabled - my current screencast sharing state
 * @property {boolean} _isInit - ensures store initialized only once
 * @property {function():void} muteVideo - function used to mute/unmute my video and share this muted data to all other players
 * @property {function():void} muteAudio - function used to mute/unmute my audio and share this muted data to all other players
 * @property {function():void} shareScreen - function used to initiate a screenshare
 * @property {function():Promise<void>} initializePersonalVideoStream - function used to initialize my video/audio capture
 * @property {function():Promise<void>} initializeScreenCastStream - function used to initialize my video/audio capture
 * @property {function(string):void} cleanupPlayer - function used to remove reference to anothe rpalyer's remote stream
 * @property {function():void} init - function used to intialize teh component and its eent listeners
 */
