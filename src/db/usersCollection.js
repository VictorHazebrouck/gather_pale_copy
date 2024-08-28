// /**
//  * @module
//  * @ignore
//  * @category DB
//  */

// import DB from "./DB";

// /**
//  *
//  * @param {DB} db
//  * @param {ConnectionDataEventData} players
//  */
// async function initializeUsers(db, { Players }) {
//     const users = await db.users.toArray();

//     // Update the isConnected property for each user
//     users.forEach((user) => {
//         user.isConnected = false;
//     });

//     // Bulk put the updated users back into the database
//     await db.users.bulkPut(users);

//     // Mark connected users as so
//     for (let { userId, userName } of Players) {
//         const user = await db.users.get(userId);

//         if (!user) {
//             db.users.add({ _id: userId, userName: userName, isConnected: true });
//             return;
//         }

//         if (user.userName !== userName) {
//             user.userName = userName;
//             syncRoomPartner(db, userId, userName);
//         }

//         user.isConnected = true;
//         db.users.put(user);
//     }
// }
// /**
//  *
//  * @param {DB} db
//  * @param {PlayerData} players
//  */
// async function handleNewUser(db, { userId, userName }) {
//     const user = await db.users.get(userId);

//     if (!user) {
//         db.users.add({ _id: userId, userName: userName, isConnected: true });
//         return;
//     }

//     if (user.userName !== userName) {
//         user.userName = userName;
//         syncRoomPartner(db, userId, userName);
//     }

//     user.isConnected = true;
//     db.users.put(user);
// }

// /**
//  * Function tha
//  *
//  * @param {DB} db
//  * @param {string} userId
//  * @param {string} newName
//  */
// async function syncRoomPartner(db, userId, newName) {
//     const correspondingroom = await db.chat_rooms.where("userId").equals(userId).first();

//     if (!correspondingroom) {
//         return;
//     }

//     correspondingroom.userName = newName;
//     db.chat_rooms.put(correspondingroom);
// }

// /**
//  *
//  * @param {DB} db
//  * @param {ANameHasChangedEventData} param1
//  */
// async function changeUserName(db, { userId, newName }) {
//     const user = await db.users.get(userId);

//     console.log("receive usernamechnge");

//     if (!user) {
//         db.users.add({ _id: userId, userName: newName, isConnected: true });
//         return;
//     }

//     if (user.userName === newName) {
//         return;
//     }

//     user.userName = newName;
//     db.users.put(user);

//     syncRoomPartner(db, userId, newName);
// }

// /**
//  *
//  * @param {DB} db
//  * @param {PlayerDisconnectdEventData} param1
//  */
// async function disconnectUser(db, { userId }) {
//     const user = await db.users.get(userId);

//     if (user) {
//         user.isConnected = false;
//         db.users.put(user);
//     }
// }

// export { initializeUsers, handleNewUser, changeUserName, disconnectUser };
