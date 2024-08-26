/**
 * @module
 * @category GAME
 */

import { Application, Ticker } from "pixi.js";
import Background from "./layers/background/Background";
import Walls from "./layers/walls/Walls"
import Game from "./camera/Camera";
import PlayersLayer from "./layers/players/PlayersLayer";
import PlayerSelf from "./player/PlayerSelf";

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

    //init game instance
    const game = new Game(app);
    app.stage.addChild(game);

    //init background
    const background = new Background();
    await background.generateBackground();
    game.addChild(background);

    //init walls 
    const walls = new Walls()
    await walls.generateWalls()
    game.addChild(walls)

    // init self
    const playerSelf = await PlayerSelf.createPlayer(playerSelfData);
    playerSelf.registerMovementInput();
    playerSelf.registerMovementInput("KeyW", "KeyS", "KeyA", "KeyD");

    // inti players layer
    const playersLayer = new PlayersLayer();
    playersLayer.addChild(playerSelf);

    game.attachCameraToObject(playerSelf);
    game.addChild(playersLayer);
}

export default initGame;
