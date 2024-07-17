import "./src/db/DB";
import "./src/stores/registerStates";
import Alpine from "alpinejs";
import Socket from "./src/Socket";
import initGame from "./src/game/main";
import PeerJS from "peerjs";

new Socket(Alpine.store("user"));
new PeerJS(Alpine.store("user").userId)

initGame(Alpine.store("user"));
