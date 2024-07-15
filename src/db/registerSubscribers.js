import eventBus from "../EventBus";
import { db } from "./DB";
import { v4 as uuidv4 } from "uuid";

/** @param {db} dataBase */
function registerSubscribers(dataBase) {
    //init db, proceed to sync names with ids, reset connection state and mak as connected
    eventBus.once("connectionData", async ({ Players }) => {
        const users = await dataBase.users.toArray();

        // Update the isConnected property for each user
        users.forEach((user) => {
            user.isConnected = false;
        });

        // Bulk put the updated users back into the database
        await dataBase.users.bulkPut(users);

        for (let { userId, userName } of Players) {
            const user = await dataBase.users.get(userId);

            if (!user) {
                dataBase.users.add({ _id: userId, userName: userName, isConnected: true });
                return;
            }

            user.userName = userName;
            user.isConnected = true;
            dataBase.users.put(user);
        }
    });

    // when a new player connects, sync his name, and mark him as connected
    eventBus.subscribe("newPlayerConnected", async ({ userId, userName }) => {
        const user = await dataBase.users.get(userId);

        if (!user) {
            dataBase.users.add({ _id: userId, userName: userName, isConnected: true });
            return;
        }

        if (user.userName === userName) {
            return;
        }

        user.userName = userName;
        dataBase.users.put(user);
    });

    eventBus.subscribe("aNameHasChanged", async ({ userId, newName }) => {
        const user = await dataBase.users.get(userId);

        if (!user) {
            dataBase.users.add({ _id: userId, userName: newName, isConnected: true });
            return;
        }

        if (user.userName === newName) {
            return;
        }

        user.userName = newName;
        dataBase.users.put(user);
    });

    // when a player disconnects, mark him as disconnected
    eventBus.subscribe("playerDisconnected", async ({ userId }) => {
        const user = await dataBase.users.get(userId);

        if (user) {
            user.isConnected = false;
            dataBase.users.put(user);
        }
    });

    eventBus.subscribe("sendChatMessage", async (data) => {
        /** If room already exists, open current one */
        const room = await dataBase.chat_rooms.get(data.roomId);

        /** @type {Message} */
        const message = {
            _id: uuidv4(),
            sender: data.userIdSender,
            value: data.value,
            time: data.time,
        };

        if (!room) {
            /** @type {Room} */
            const room = {
                _id: data.roomId,
                userId: data.userIdReceiver,
                userName: data.userNameReceiver,
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
