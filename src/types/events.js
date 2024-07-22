/**
 * @module
 * @category EVENT_BUS
 * @ignore
 */

/**
 * List of all event names with their corresponding data to be passed around.
 *
 * @typedef {Object} EventsList
 * @property {ConnectionDataEventData} receive_initial_gamestate
 * @property {NewPlayerConnectedEventData} new_player_connected
 * @property {PlayerDisconnectdEventData} player_disconnected
 * @property {MoveEventData} initiate_move_instructions
 * @property {NewPlayerMoveEventData} receive_move_instructions
 * @property  {PlayerClickEventData} game_player_clicked
 * @property  {GamePlayerJoinNearbyEventData} game_player_join_nearby_area
 * @property  {GamePlayerLeaveNearbyEventData} game_player_leave_nearby_area
 *
 * @property {SendChatMessageEventData} initiate_chat_message
 * @property {ChatMessageReceivedEventData} receive_chat_message
 * @property {NameChangedEventData} initiate_username_change
 * @property {ANameHasChangedEventData} receive_username_change
 *
 * @property  {DBUsersHasChangedEventData} DB_users_has_changed
 * @property  {DBRoomsHasChangedEventData} DB_rooms_has_changed
 * @property  {DBRoomsInit} DB_rooms_init
 * @property  {DBUsersInit} DB_users_init
 *
 * @property {InitializePersonalVideoStream} personal_media_stream_initialized
 * @property  {PeerInitiateCallEventData} peer_initiate_call_request
 * @property  {PeerReceiveCallEventData} peer_receive_call_request
 * @property  {PeerReceiveMediaStreamEventData} peer_receive_media_stream
 *
 * @property {PlayerAudioMuteStateChange} initiate_video_mute_change
 * @property {PlayerVideoMuteStateChange} initiate_audio_mute_change
 * @property {ReceivePlayerVideoMuteStateChange} receive_audio_mute_change
 * @property {ReceivePlayerVideoMuteStateChange} receive_video_mute_change
 */

/**
 * @typedef {User[]} DBUsersHasChangedEventData
 *
 * @event DB_users_has_changed
 * @type {DBUsersHasChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Room[]} DBRoomsHasChangedEventData
 *
 * @event DB_rooms_has_changed
 * @type {DBRoomsHasChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Room[]} DBRoomsInit
 *
 * @event DB_rooms_init
 * @type {DBRoomsHasChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {User[]} DBUsersInit
 *
 * @event DB_users_init
 * @type {DBUsersInit}
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
 * @event initiate_chat_message
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
 * @event receive_chat_message
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
 * @event initiate_move_instructions
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
 * @event receive_move_instructions
 * @type {NewPlayerMoveEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {PlayerDataWithCoordinates} NewPlayerConnectedEventData
 *
 * @event new_player_connected
 * @type {NewPlayerConnectedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} ConnectionDataEventData
 * @property {PlayerDataWithCoordinates[]} Players
 *
 * @event receive_initial_gamestate
 * @type {ConnectionDataEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} PlayerDisconnectdEventData
 * @property {string} userId
 *
 * @event player_disconnected
 * @type {PlayerDisconnectdEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} NameChangedEventData
 * @property {string} newName
 *
 * @event initiate_username_change
 * @type {NameChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} ANameHasChangedEventData
 * @property {string} newName
 * @property {string} userId
 *
 * @event receive_username_change
 * @type {ANameHasChangedEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} PlayerClickEventData
 * @property {PlayerData} playerInformation
 * @property {Coordinates} position
 *
 * @event game_player_clicked
 * @type {PlayerClickEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} PeerReceiveCallEventData
 * @property {string} userId
 *
 * @event peer_receive_call_request
 * @type {PeerReceiveCallEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} PeerInitiateCallEventData
 * @property {string} userIdCaller
 * @property {string} userIdReceiver
 *
 * @event peer_initiate_call_request
 * @type {PeerInitiateCallEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} PeerReceiveMediaStreamEventData
 * @property {string} userIdCaller
 * @property {MediaStream} stream
 *
 * @event peer_receive_media_stream
 * @type {PeerReceiveMediaStreamEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {MediaStream} InitializePersonalVideoStream
 *
 * @event personal_media_stream_initialized
 * @type {InitializePersonalVideoStream}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} GamePlayerJoinNearbyEventData
 * @property {string} userId
 *
 * @event game_player_join_nearby_area
 * @type {GamePlayerJoinNearbyEventData}
 * @category EVENT_BUS
 */

/**
 * @typedef {boolean} PlayerAudioMuteStateChange
 *
 * @event initiate_audio_mute_change
 * @type {PlayerAudioMuteStateChange}
 * @category EVENT_BUS
 */

/**
 * @typedef {object} ReceivePlayerAudioMuteStateChange
 * @property {boolean} state
 * @property {string} userId
 *
 * @event initiate_audio_mute_change
 * @type {PlayerAudioMuteStateChange}
 * @category EVENT_BUS
 */

/**
 * @typedef {boolean} PlayerVideoMuteStateChange
 *
 * @event initiate_video_mute_change
 * @type {PlayerVideoMuteStateChange}
 * @category EVENT_BUS
 */

/**
 * @typedef {object} ReceivePlayerVideoMuteStateChange
 * @property {boolean} state
 * @property {string} userId
 *
 * @event initiate_video_mute_change
 * @type {PlayerVideoMuteStateChange}
 * @category EVENT_BUS
 */

/**
 * @typedef {Object} GamePlayerLeaveNearbyEventData
 * @property {string} userId
 *
 * @event game_player_leave_nearby_area
 * @type {GamePlayerLeaveNearbyEventData}
 * @category EVENT_BUS
 */
