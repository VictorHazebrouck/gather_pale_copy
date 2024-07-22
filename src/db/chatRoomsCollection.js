/**
 * @module
 * @ignore
 * @category DB
 */

import DB from "./DB";
import { v4 as uuidv4 } from "uuid";

/**
 *
 * @param {DB} db
 * @param {SendChatMessageEventData} data
 */
async function newChatMessage(db, data) {
    const { userIdSender, userNameReceiver, userIdReceiver, value, time } = data;
    /** If room already exists, open current one */
    const room = await db.chat_rooms.where("userId").equals(userIdReceiver).first();

    /** @type {Message} */
    const message = {
        _id: uuidv4(),
        sender: userIdSender,
        value: value,
        time: time,
    };

    if (!room) {
        /** @type {Room} */
        const room = {
            _id: uuidv4(),
            userId: userIdReceiver,
            userName: userNameReceiver,
            messages: [message],
        };

        await db.chat_rooms.add(room);
        return;
    }

    /** Add the message to your own chat && save it to db*/
    room.messages.push(message);
    await db.chat_rooms.put(room);
}

export { newChatMessage };
