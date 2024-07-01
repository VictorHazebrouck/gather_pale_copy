import { Spritesheet, Ticker } from "pixi.js";
import SocketManager from "../../sockets/socketManager";
import Player from "./Player";
import Alpine from "alpinejs";
import { isPlayer } from "../utils/utils";
import { loadPlayerSprite } from "../utils/utils";

const socket = SocketManager.getSocket();

class PlayerOther extends Player {
    /**
     * @param {PlayerData & Coordinates} data - player data necessary to init the player
     * @param {Spritesheet} spriteSheet - spritesheet
     */
    constructor({ x, y, ...rest }, spriteSheet) {
        super({ ...rest }, spriteSheet);

        this.position.x = x;
        this.position.y = y;

        this.interactive = true;
        this._registerOnClickActions();
        this._registerRemoteActions();
        Ticker.shared.add(this._playerMovement);
    }

    /** @param {Ticker} ticker - data about the update loop */
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
        socket.on("newPlayerMove", (data) => {
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
        socket.on("playerDisconnected", ({ userId }) => {
            if (this.playerInformation.userId === userId) {
                this.destroy();
            }
        });
    };

    _registerOnClickActions = () => {
        /** Display playerCard on click */
        this.addEventListener("click", () => {
            Alpine.store("playerCard").showCard(this.playerInformation, this.getScreenPosition());
        });
    };

    /**
     * Handles new player creation, avoids creating duplicates
     * @static
     *
     * @param {PlayerData & Coordinates} playerData - data for the player we're trying ot pass in
     * @param {import("pixi.js").ContainerChild[]} siblings - data from all current players in the container
     * @returns {Promise<PlayerOther | false>} - returns the player instance or false
     */
    static createPlayer = async (playerData, siblings) => {
        /** @type {Player[]} */
        const players = siblings.filter(isPlayer);

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
