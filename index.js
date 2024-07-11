import "./src/db/init";
import "./src/stores/registerStates";
import Alpine from "alpinejs";
import Socket from "./src/Socket";
import initGame from "./src/game/main";

new Socket(Alpine.store("user"));

initGame(Alpine.store("user"));
