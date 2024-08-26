/**
 * @module
 * @category GAME
 */

import { Application, Ticker } from "pixi.js";
import Background from "./layers/background/Background";
import Walls from "./layers/walls/Walls"
import Camera from "./camera/Camera";
import PlayersLayer from "./layers/players/PlayersLayer";
import PlayerSelf from "./player/PlayerSelf";
import Layers from "./layers/Layers";

/**
 * Initialization function
 *
 * @param {UserStore} playerSelfData
 * @returns {Promise<void>}
 */
async function initGame(playerSelfData) {
    // get the dom element in which to place the game
    const gamecontainer = document.getElementById("container-game");
    if (!gamecontainer) {
        throw new Error("COULDN'T FIND GAME CONTAINER");
    }

    //init the Application instance
    const app = new Application();
    await app.init({ resizeTo: gamecontainer });
    gamecontainer.appendChild(app.canvas);
    Ticker.shared.autoStart = true;

    const layers = new Layers()
    await layers.createLayers(app, playerSelfData)
    
    if(!layers.camera) {
        throw new Error("couldn't get camera")
    }
    app.stage.addChild(layers.camera)
}

export default initGame;
