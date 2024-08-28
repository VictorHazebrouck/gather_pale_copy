/**
 * @module
 * @ignore
 * */
import { Ticker } from "pixi.js";
import { filterPlayers, loadPlayerSprite } from "./utils/utils";
import PlayerBase from "./PlayerBase";
import eventBus from "../../EventBus";

/**
 * Class
 *
 * @category GAME
 * @subcategory PLAYER
 */
class PlayerOther extends PlayerBase {
    /**
     * @param {PlayerDataWithCoordinates} data - player data necessary to init the player
     * @param {import('pixi.js').Spritesheet} spriteSheet - spritesheet
     * @param {import('../layers/Layers').default} layers
     */
    constructor(data, spriteSheet, layers) {
        super(data, spriteSheet, layers);

        this.interactive = true;
        this._registerOnClickActions();
        this._registerRemoteActions();
        Ticker.shared.add(this._playerMovement);
    }

    /**
     * @private
     * @param {Ticker} ticker - data about the update loop
     * @method
     */
    _playerMovement = (ticker) => {
        /** dont perform calculations of player is stopped */
        if (this.moveDirection === "stop") {
            return;
        }

        if (this.position && this.position.x && this.position.y) {
            this.movePlayer(ticker, this.moveDirection);
        }
    };

    _registerRemoteActions = () => {
        /**
         * If the broadcasted move is from the player himself, move his sprite accordingly
         *@param {MoveInstructions} data
         */
        const handleMovement = (data) => {
            const { userId, direction, x, y } = data;

            if (this.playerInformation.userId !== userId) {
                return;
            }

            this.moveDirection = direction;

            /** Ensures proper sync between clients */
            if (this.position && this.position.x && this.position.y) {
                this.position.x = x;
                this.position.y = y;
            }
        };
        handleMovement.bind(this);

        eventBus.subscribe("receive_move_instructions", handleMovement);

        /**
         * If the broadcasted move is from the player himself,
         * destroy his instance and remove his listeners
         * @param {PlayerDisconnectdEventData} data
         */
        const disconnectUser = ({ userId }) => {
            if (this.playerInformation.userId === userId) {
                this.destroy();
                eventBus.unsubscribe("receive_move_instructions", handleMovement);
                eventBus.unsubscribe("player_disconnected", disconnectUser);
            }
        };
        disconnectUser.bind(this);

        eventBus.subscribe("player_disconnected", disconnectUser);
    };

    _registerOnClickActions = () => {
        /** Display playerCard on click */
        this.addEventListener("click", () => {
            eventBus.publish("game_player_clicked", {
                playerInformation: this.playerInformation,
                position: this.getScreenPosition(),
            });
        });
    };

    /**
     * Handles new player creation, avoids creating duplicates
     * @static
     * @method
     *
     * @param {PlayerDataWithCoordinates} playerData - data for the player we're trying ot pass in
     * @param {import("pixi.js").ContainerChild[]} siblings - data from all current players in the container
     * @param {import('../layers/Layers').default} layers
     * @returns {Promise<PlayerOther | false>} - returns the player instance or false
     */
    static createPlayer = async (playerData, siblings, layers) => {
        const players = filterPlayers(siblings);

        for (const player of players) {
            if (player?.playerInformation?.userId === playerData.userId) {
                return false;
            }
        }
        const spriteSheet = await loadPlayerSprite();

        return new PlayerOther(playerData, spriteSheet, layers);
    };
}

export default PlayerOther;
