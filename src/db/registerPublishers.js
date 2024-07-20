import eventBus from "../EventBus";
import { db } from "./DB";

/** @param {db} dataBase */
function registerPublishers(dataBase) {
    dataBase.chat_rooms.hook("updating", async (modifications, primKey, obj, transaction) => {
        // handler used to retrun refreshed collection after update
        async function handleRefresh() {
            const rooms = await dataBase.chat_rooms.toArray();
            eventBus.publish("DB_rooms_has_changed", rooms);
        }

        transaction.on.complete.subscribe(handleRefresh);
    });

    dataBase.users.hook("updating", async (modifications, primKey, obj, transaction) => {
        // handler used to retrun refreshed collection after update
        async function handleRefresh() {
            const users = await dataBase.users.toArray();
            eventBus.publish("DB_users_has_changed", users);
        }

        transaction.on.complete.subscribe(handleRefresh);
    });
}

export default registerPublishers;
