/**
 * @module
 * @ignore
 * @category DB
 */

import Dexie from "dexie";
import eventBus from "../EventBus";
import registerSubscribers from "./registerSubscribers";
import registerPublishers from "./registerPublishers";

const DB_NAME = "gatheresque_db";
const DB_VERSION = 1;

/**
 * @class
 * @category DB
 */
class DB extends Dexie {
    constructor() {
        super(DB_NAME);

        /** register stores and their schemas */
        this.version(DB_VERSION).stores({
            users: "_id, name",
            chat_rooms: "_id, userId, userName, messages",
        });

        /** @type {Dexie.Table<User, string>} */
        this.users = this.table("users");

        /** @type {Dexie.Table<Room, string>} */
        this.chat_rooms = this.table("chat_rooms");
    }

    async init() {
        try {
            await this.open();
            console.log("Database initialized");
            registerSubscribers(this);
            registerPublishers(this);

            const chatrooms = await this.chat_rooms.toArray();
            eventBus.publish("DB_rooms_init", chatrooms);

            const users = await this.users.toArray();
            eventBus.publish("DB_users_init", users);
        } catch (err) {
            throw new Error(String(err));
        }
    }

    async deleteDB() {
        await this.delete();
        await this.open();
    }
}

export default DB;
