import Alpine from "alpinejs";
import Socket from "./src/Socket";
import "./src/db/init";
import "./src/stores/registerStates";
import "./src/game/main";

new Socket(Alpine.store("user"))
