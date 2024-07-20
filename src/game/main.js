/**
 * @module
 * @category GAME
 */

import { Application, Ticker } from "pixi.js";
import Background from "./layers/background/Background";
import Game from "./game/Game";
import PlayersLayer from "./layers/players/PlayersLayer";

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

    const players = new PlayersLayer(playerSelfData, game);
    game.addChild(players);
}

export default initGame;
