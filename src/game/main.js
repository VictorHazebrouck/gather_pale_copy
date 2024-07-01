import { Application, Ticker } from "pixi.js";
import Background from "./layers/background/Background";
import SocketManager from "../sockets/socketManager";
import Game from "./game/Game";
import PlayerSelf from "./player/PlayerSelf";
import PlayerOther from "./player/PlayerOther";

/**
 * Initialization function
 *
 * @returns {Promise<void>}
 */
async function init() {
    //get socket instance
    const socket = SocketManager.getSocket();

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

    //init self player and attach the camera to it
    const player = new PlayerSelf();
    player.registerMovementInput()
    //player.registerMovementInput("KeyW","KeyS","KeyA","KeyD")
    
    game.addChild(player);
    game.attachCameraToObject(player);

    //handle first connection, get current game state from server
    socket.on("connectionData", (data) => {
        for (let i = 0; i < data.Players.length; i++) {
            const player = PlayerOther.createPlayer(data.Players[i], game.children);
            player && game.addChild(player);
        }
    });

    //handle new players connection, get new player's data
    socket.on("newPlayerConnected", (newPlayerData) => {
        const player = PlayerOther.createPlayer(newPlayerData, game.children);
        player && game.addChild(player);
    });
}

await init();
