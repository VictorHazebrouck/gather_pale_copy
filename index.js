import DB from "./src/db/DB";
import "./src/alpine/registerStates";
import Alpine from "alpinejs";
import Socket from "./src/Socket";
import initGame from "./src/game/main";
import PeerJS from "./src/rtc/peerToPeer/peer";

new DB().init()
new Socket(Alpine.store("user"));
new PeerJS(Alpine.store("user").userId);

initGame(Alpine.store("user"));
