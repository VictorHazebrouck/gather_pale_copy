import Dexie from "dexie";
import eventBus from "../EventBus";

const DB_NAME = "gatheresque_db";
const DB_VERSION = 1;

let counter = 0;

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

    registerSubscribers() {
        //init db, proceed to sync names with ids, reset connection state and mak as connected
        eventBus.subscribe("connectionData", async ({ Players }) => {
            const users = await this.users.toArray();

            // Update the isConnected property for each user
            users.forEach((user) => {
                user.isConnected = false;
            });

            // Bulk put the updated users back into the database
            await this.users.bulkPut(users);

            for (let { userId, userName } of Players) {
                const user = await this.users.get(userId);

                if (!user) {
                    this.users.add({ _id: userId, userName: userName, isConnected: true });
                    return;
                }

                user.userName = userName;
                user.isConnected = true;
                this.users.put(user);
            }
        });

        // when a new player connects, sync his name, and mark him as connected
        eventBus.subscribe("newPlayerConnected", async ({ userId, userName }) => {
            const user = await this.users.get(userId);

            if (!user) {
                this.users.add({ _id: userId, userName: userName, isConnected: true });
                return;
            }

            if (user.userName === userName) {
                return;
            }

            user.userName = userName;
            this.users.put(user);
        });

        eventBus.subscribe("aNameHasChanged", async ({ userId, newName }) => {
            const user = await this.users.get(userId);

            if (!user) {
                this.users.add({ _id: userId, userName: newName, isConnected: true });
                return;
            }

            if (user.userName === newName) {
                return;
            }

            user.userName = newName;
            this.users.put(user);
        });

        // when a player disconnects, mark him as disconnected
        eventBus.subscribe("playerDisconnected", async ({ userId }) => {
            const user = await this.users.get(userId);

            if (user) {
                user.isConnected = false;
                this.users.put(user);
            }
        });
    }

    registerPublishers() {
        this.chat_rooms.hook("updating", async (modifications, primKey, obj, transaction) => {
            // console.log("modif: ", modifications);
            // console.log("---------------------------");
            // console.log("primKey: ", primKey);
            // console.log("---------------------------");
            // console.log("obj: ", obj);
            // console.log("---------------------------");
            // console.log("transaction: ", transaction);
            // counter++;
            // console.log("C:", counter);
            // const zzz = await this.chat_rooms.toArray();
            // console.log("DB:", zzz);
        });

        this.users.hook("updating", async (modifications, primKey, obj, transaction) => {
            const users = await this.users.toArray();
            eventBus.publish("DBUsersHasChanged", users);
        });
    }

    async init() {
        try {
            await this.open();
            console.log("Database initialized");
            this.registerSubscribers();
            this.registerPublishers();
        } catch (error) {
            throw new Error("Failed to initialize database");
        }
    }

    async deleteDB() {
        await this.delete();
        await this.open();
    }
}

const DB = new db();
DB.init();

export default DB;
