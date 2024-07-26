/**
 * @module
 * @ignore
 */

import { Container } from "pixi.js";
import EventBus from "../../../EventBus";
import PlayerSelf from "../../player/PlayerSelf";
import PlayerOther from "../../player/PlayerOther";

/**
 * Player class that extends AnimatedSprite.
 *
 * @category GAME
 * @subcategory LAYERS
 * @extends Container
 */
class PlayersLayer extends Container {
    /**
     *
     * @param {UserStore} playerSelfData
     */
    constructor(playerSelfData, game) {
        super();

        // add self to container
        PlayerSelf.createPlayer(playerSelfData).then((player) => {
            player.registerMovementInput();
            player.registerMovementInput("KeyZ", "KeyS", "KeyQ", "KeyD");
            this.addChild(player);
            game.attachCameraToObject(player);
        });

        this.init();
    }

    init() {
        //handle first connection, get current game state from server
        EventBus.subscribe("receive_initial_gamestate", async (data) => {
            for (let i = 0; i < data.Players.length; i++) {
                const player = await PlayerOther.createPlayer(data.Players[i], this.children);

                if (player) {
                    this.addChild(player);
                }
            }
        });

        //handle new players connection, get new player's data
        EventBus.subscribe("new_player_connected", async (newPlayerData) => {
            const player = await PlayerOther.createPlayer(newPlayerData, this.children);

            if (player) {
                this.addChild(player);
            }
        });
    }
}

export default PlayersLayer;
