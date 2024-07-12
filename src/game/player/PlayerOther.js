/**
 * @category GAME
 * @module
 * @ignore
 */
import { Spritesheet, Ticker } from "pixi.js";
import { filterPlayers, loadPlayerSprite } from "../utils/utils";
import EventBus from "../../EventBus";
import PlayerBase from "./PlayerBase";


/**
 * Class
 * 
 * @category GAME
 * @subcategory PLAYER
 */
class PlayerOther extends PlayerBase {
    /**
     * @param {PlayerDataWithCoordinates} data - player data necessary to init the player
     * @param {Spritesheet} spriteSheet - spritesheet
     */
    constructor(data, spriteSheet) {
        super(data, spriteSheet);

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
        /** If the broadcasted move is from the player himself, move his sprite accordingly */
        EventBus.subscribe("newPlayerMove", (data) => {
            /** @type  {MoveInstructions} */
            const { userId, direction, x, y } = data;

            if (this.playerInformation.userId !== userId) {
                return;
            }

            this.moveDirection = direction;

            /**
             * Ensures proper sync between clients
             *
             * @todo find proper fix for this,
             *      - currently: `this.position.x || this.position.y is not defined`
             */
            if (this.position && this.position.x && this.position.y) {
                this.position.x = x;
                this.position.y = y;
            }
        });

        /** If the broadcasted move is from the player himself, destroy his instance */
        EventBus.subscribe("playerDisconnected", ({ userId }) => {
            if (this.playerInformation.userId === userId) {
                this.destroy();
            }
        });
    };

    _registerOnClickActions = () => {
        /** Display playerCard on click */
        this.addEventListener("click", () => {
            EventBus.publish("playerClick", {
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
     * @returns {Promise<PlayerOther | false>} - returns the player instance or false
     */
    static createPlayer = async (playerData, siblings) => {
        const players = filterPlayers(siblings);

        for (const player of players) {
            if (player?.playerInformation?.userId === playerData.userId) {
                return false;
            }
        }
        const spriteSheet = await loadPlayerSprite();

        return new PlayerOther(playerData, spriteSheet);
    };
}

export default PlayerOther;
