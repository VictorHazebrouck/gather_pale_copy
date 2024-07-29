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
Alpine.store("videoChat", storeVideoChat);
Alpine.store("utils", storeUtils);
Alpine.store("chat", storeChat);
Alpine.store("playerCard", storePlayerCard);
Alpine.store("participants", storeParticipants);

export default Alpine;
