import DB from "./init";

const ChatCollection = DB.chat_rooms;
const UsersCollection = DB.users;

/**
 * Function to create a new room in idb
 *
 * @param {Room} room - message in case new messgage gets added along with the room
 * @returns {Promise<Room>} - Room data
 */
async function newRoomDb(room) {
    await ChatCollection.add(room);
    return room;
}

/**
 * Function to get rooms from indexed db
 *
 * @returns {Promise<Room[]>} - returns all rooms from idb
 */
async function getRoomsDb() {
    const chatData = await ChatCollection.toArray();

    for (let room of chatData) {
        const user = await UsersCollection.get(room.userId);

        if (user) {
            room.userName = user.userName;
            await ChatCollection.put(room);
        }
    }

    return chatData;
}

/**
 * Function to add new chat to db
 *
 * @param {string} roomId - room unique identifier
 * @param {Message} chat - message to save
 */
async function newChatDb(roomId, chat) {
    const room = await ChatCollection.get(roomId);

    if (!room) {
        return;
    }

    room.messages.push(chat);
    ChatCollection.put(room);
}

export { newRoomDb, newChatDb, getRoomsDb };
