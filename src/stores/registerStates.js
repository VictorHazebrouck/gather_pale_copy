import Alpine from "./registerPlugins";
import storeChat from "./storeChat";
import storeUtils from "./storeUtils";
import storePlayerCard from "./storePlayerCard";
import storeUserPersist from "./storeUserPersist";
import storeParticipants from "./storeParticipants";
import storeVideoChat from "./storeVideoChat";

/** Register local storage stuff first */
Alpine.store("user", storeUserPersist);

/** Register reactive data */
Alpine.store("utils", storeUtils);
Alpine.store("chat", storeChat);
Alpine.store("playerCard", storePlayerCard);
Alpine.store("participants", storeParticipants);
Alpine.store("videoChat", storeVideoChat);

/** Start the application */
Alpine.start();

export default Alpine;
