import DB from "./src/db/DB";
import "./src/alpine/registerStates";
import Alpine from "alpinejs";
import Socket from "./src/Socket";
import initGame from "./src/game/main";
import PeerJS from "./src/rtc/peerToPeer/peer";
import eventBus from "./src/EventBus";

//inti Alpine state manager first
Alpine.start();

initGame(Alpine.store("user"));

//inti db
new DB().init();

//init socket io stuff
new Socket(Alpine.store("user"));
new PeerJS(Alpine.store("user").userId);

let isSocketInit = false;
let isPeerInit = false;

eventBus.once("socket_successfull_initialization", () => {
    isSocketInit = true;
    console.log("successfull connection to socket");
    checkInitialization();
});

eventBus.once("peer_successfull_initialization", () => {
    isPeerInit = true;
    console.log("successfull connection to peer server");
    checkInitialization();
});

//Ensure both socket.io and peer.js are ready before initializing game
function checkInitialization() {
    if (isSocketInit && isPeerInit) {
        console.log("Socket and PeerJS initialization complete, starting game");
        // initGame(Alpine.store("user"));
    }
}
