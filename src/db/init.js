import Dexie from "dexie";

const DB_NAME = "gatheresque_db";
const DB_VERSION = 1;

class db extends Dexie {
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
        } catch (error) {
            console.error("Failed to initialize database:", error);
        }
    }

    deleteDB() {
        this.delete();
        this.open();
    }
}

const DB = new db();
await DB.init();

export default DB;
