import Alpine from "./registerPlugins";
import SocketManager from "../sockets/socketManager";
import storeChat from "./storeChat";
import storeUtils from "./storeUtils";
import storePlayerCard from "./storePlayerCard";
import storeUserPersist from "./storeUserPersist";
import storeParticipants from "./storeParticipants";

/** Register local storage stuff first */
Alpine.store("user", storeUserPersist);

/** Init socket with localStorage stuff */
SocketManager.init(Alpine.store("user"));

/** Register reactive data */
Alpine.store("utils", storeUtils);
Alpine.store("chat", storeChat);
Alpine.store("playerCard", storePlayerCard);
Alpine.store("participants", storeParticipants);

/** Start the application */
Alpine.start();

export default Alpine;
