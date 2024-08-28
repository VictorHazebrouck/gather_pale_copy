/**
 * @module
 * @ignore
 */

import { Container } from "pixi.js";
import EventBus from "../../../EventBus";
import PlayerOther from "../../player/PlayerOther";
import PlayerSelf from "../../player/PlayerSelf";

/**
 * Player class that extends AnimatedSprite.
 *
 * @category GAME
 * @subcategory LAYERS
 * @extends Container
 */
class PlayersLayer extends Container {
    /**
     * @param {import('../Layers').default} layers
     */
    constructor(layers) {
        super();
        this.zIndex = 2;
        this.initListeners(layers);
    }

    /**
     * @param {import('../Layers').default} layers
     */
    initListeners(layers) {
        //handle first connection, get current game state from server
        EventBus.subscribe("receive_initial_gamestate", async (data) => {
            for (let i = 0; i < data.Players.length; i++) {
                const player = await PlayerOther.createPlayer(
                    data.Players[i],
                    this.children,
                    layers
                );

                if (player) {
                    this.addChild(player);
                }
            }
        });

        //handle new players connection, get new player's data
        EventBus.subscribe("new_player_connected", async (newPlayerData) => {
            const player = await PlayerOther.createPlayer(newPlayerData, this.children, layers);

            if (player) {
                this.addChild(player);
            }
        });
    }
    /**
     *
     * @param {UserStore} playerSelfData
     * @param {import('../Layers').default} layers
     * @returns {Promise<PlayerSelf>}
     */
    async createSelf(playerSelfData, layers) {
        const playerSelf = await PlayerSelf.createPlayer(playerSelfData, layers);
        playerSelf.registerMovementInput();
        playerSelf.registerMovementInput("KeyW", "KeyS", "KeyA", "KeyD");
        this.addChild(playerSelf);

        return playerSelf;
    }
}

export default PlayersLayer;
