import DB from "./init";

const UsersCollection = DB.users;
const ChatCollection = DB.chat_rooms;

/**
 * Function to create a new user in idb
 *
 * @param {string} id - id of the user
 * @param {string} username - name of the user
 * @returns {Promise<void>}
 */
async function newUserDB(id, username) {
    const user = await UsersCollection.get(id);

    if (!user) {
        UsersCollection.add({ _id: id, userName: username });
        return;
    }

    user.userName = username;
    UsersCollection.put(user);
}

async function getUsersDB(){
    const users = await UsersCollection.toArray();
    return users
}

export { newUserDB, getUsersDB };
