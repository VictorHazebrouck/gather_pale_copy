/**
 * @module
 * @category GAME
 */

import { Application, Ticker } from "pixi.js";
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

    const layers = await Layers.createLayers(app, playerSelfData)
    
    if(!layers.camera) {
        throw new Error("couldn't get camera")
    }
    app.stage.addChild(layers.camera)
}

export default initGame;
