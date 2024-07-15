import { db } from "./DB";
import eventBus from "../EventBus";

/** @param {db} dataBase */
function registerPublishers(dataBase) {
    dataBase.chat_rooms.hook("updating", async (modifications, primKey, obj, transaction) => {
        // handler used to retrun refreshed collection after update
        async function handleRefresh() {
            const rooms = await dataBase.chat_rooms.toArray();
            eventBus.publish("DBRoomsHasChanged", rooms);
        }

        transaction.on.complete.subscribe(handleRefresh);
    });

    dataBase.users.hook("updating", async (modifications, primKey, obj, transaction) => {
        // handler used to retrun refreshed collection after update
        async function handleRefresh() {
            const users = await dataBase.users.toArray();
            eventBus.publish("DBUsersHasChanged", users);
        }

        transaction.on.complete.subscribe(handleRefresh);
    });
}

export default registerPublishers;
