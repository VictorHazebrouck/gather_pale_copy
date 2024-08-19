/**
 * @module
 * @category DB
 */

import eventBus from "../EventBus";
import DB from "./DB";
import { v4 as uuidv4 } from "uuid";

/**
 * @param {DB} dataBase
 * @param {string} userId
 * @param {string} newName
 */
async function syncRoomPartner(dataBase, userId, newName) {
    const correspondingroom = await dataBase.chat_rooms.where("userId").equals(userId).first();

    if (!correspondingroom) {
        return;
    }

    correspondingroom.userName = newName;
    dataBase.chat_rooms.put(correspondingroom);
}

/** @param {DB} dataBase */
function registerSubscribers(dataBase) {
    //init db, proceed to sync names with ids, reset connection state and mak as connected
    eventBus.once("receive_initial_gamestate", async ({ Players }) => {
        const users = await dataBase.users.toArray();

        // Update the isConnected property for each user
        users.forEach((user) => {
            user.isConnected = false;
        });

        // Bulk put the updated users back into the database
        await dataBase.users.bulkPut(users);

        // Mark connected users as so
        for (let { userId, userName } of Players) {
            const user = await dataBase.users.get(userId);

            if (!user) {
                dataBase.users.add({ _id: userId, userName: userName, isConnected: true });
                continue;
            }

            if (user.userName !== userName) {
                user.userName = userName;
                syncRoomPartner(dataBase, userId, userName);
            }

            user.isConnected = true;
            dataBase.users.put(user);
        }
    });

    // when a new player connects, sync his name, and mark him as connected
    eventBus.subscribe("new_player_connected", async ({ userId, userName }) => {
        const user = await dataBase.users.get(userId);

        if (!user) {
            dataBase.users.add({ _id: userId, userName: userName, isConnected: true });
            return;
        }

        if (user.userName !== userName) {
            user.userName = userName;
            syncRoomPartner(dataBase, userId, userName);
        }

        user.isConnected = true;
        dataBase.users.put(user);
    });

    eventBus.subscribe("receive_username_change", async ({ userId, newName }) => {
        const user = await dataBase.users.get(userId);

        console.log("receive usernamechnge");

        if (!user) {
            dataBase.users.add({ _id: userId, userName: newName, isConnected: true });
            return;
        }

        if (user.userName === newName) {
            return;
        }

        user.userName = newName;
        dataBase.users.put(user);

        syncRoomPartner(dataBase, userId, newName);
    });

    // when a player disconnects, mark him as disconnected
    eventBus.subscribe("player_disconnected", async ({ userId }) => {
        const user = await dataBase.users.get(userId);

        if (user) {
            user.isConnected = false;
            dataBase.users.put(user);
        }
    });

    eventBus.subscribe("initiate_chat_message", async (data) => {
        const { userIdSender, userNameReceiver, userIdReceiver, value, time, roomId } = data;
        /** If room already exists, open current one */
        const room = await dataBase.chat_rooms.where("userId").equals(userIdReceiver).first();

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
                _id: roomId,
                userId: userIdReceiver,
                userName: userNameReceiver,
                messages: [message],
            };

            await dataBase.chat_rooms.add(room);
            return;
        }

        /** Add the message to your own chat && save it to db*/
        room.messages.push(message);
        await dataBase.chat_rooms.put(room);
    });

    eventBus.subscribe("receive_chat_message", async (data) => {
        const { userIdSender, userNameSender, value, time } = data;

        const room = await dataBase.chat_rooms.where("userId").equals(userIdSender).first();

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
                userId: userIdSender,
                userName: userNameSender,
                messages: [message],
            };

            await dataBase.chat_rooms.add(room);
            return;
        }

        /** Add the message to your own chat && save it to db*/
        room.messages.push(message);
        await dataBase.chat_rooms.put(room);
    });
}

export default registerSubscribers;
