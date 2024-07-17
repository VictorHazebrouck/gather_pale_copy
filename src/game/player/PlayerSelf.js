/**
 * @module
 * @ignore
 */
import { Ticker, Spritesheet } from "pixi.js";
import EventBus from "../../EventBus";
import PlayerBase from "./PlayerBase";
import Alpine from "alpinejs";
import { filterPlayerOthers, loadPlayerSprite } from "../utils/utils";

/**
 * PlayerSelf class that extends PlayerBase.
 *
 * @category GAME
 * @subcategory PLAYER
 */
class PlayerSelf extends PlayerBase {
    /**
     * @constructor
     * @param {UserStore} playerSelfData - spritesheet
     * @param {Spritesheet} spriteSheet - spritesheet
     */
    constructor(spriteSheet, playerSelfData) {
        /** @type {PlayerDataWithCoordinates} */
        const obj = {
            userId: playerSelfData.userId,
            userName: playerSelfData.userName,
            x: playerSelfData.lastPositionX,
            y: playerSelfData.lastPositionY,
        };

        super(obj, spriteSheet);

        Ticker.shared.add(this._playerMovement);
    }

    /**
     * Used together with "moveDirection" to detect a change in requested direction
     * Keeps track multiple key pressed at the same time while only allowing for strict x||y movement
     *
     * @type {Direction[]}
     */
    queuedDirections = [];

    /**
     * Called on each frame to update the position of the player according to its current moveDirection.
     * @private
     * @method
     *
     * @param {Ticker} ticker - time passed since last frame, used for consistent speed.
     * @returns {void}
     */
    _playerMovement = (ticker) => {
        /** Don't perform further calculations if player is stopped */
        if (this.moveDirection === "stop") {
            return;
        }

        const collidableObjects = filterPlayerOthers(this.parent.children);

        /** Check for collision with each sibling objects */
        for (const object of collidableObjects) {
            /**
             * If player has collided, stop his movement, share the stop event to other clients
             * used only in playerSelf to avoid each client collision checking each player on each frame
             */
            if (this.hasCollided(this.moveDirection, object)) {
                /** @type {MoveInstructions} */
                const obj = {
                    userId: this.playerInformation.userId,
                    direction: "stop",
                    x: this.position.x,
                    y: this.position.y,
                };

                EventBus.publish("initiate_move_instructions", obj);

                this.moveDirection = "stop";
                return;
            }
        }

        Alpine.store("user").lastPositionX = this.x;
        Alpine.store("user").lastPositionY = this.y;

        /** If no collision && instruction to move, move player smoothly */
        this.movePlayer(ticker, this.moveDirection);
    };

    /**
     * Sends movement instructions to the server and to self only when a change of direction occurs
     * @private
     * @method
     */
    _handleMovementInput = () => {
        if (this.moveDirection === this.queuedDirections[0]) {
            return;
        }
        this.moveDirection = this.queuedDirections[0] || "stop";

        /** @type {MoveInstructions} */
        const obj = {
            userId: this.playerInformation.userId,
            direction: this.moveDirection,
            x: this.position.x,
            y: this.position.y,
        };
        EventBus.publish("initiate_move_instructions", obj);
    };

    /**
     * Adds event listeners for arrow keys, queues/removes directions instructions under queuedDirections
     * Initialized by the component itself to arrow keys, calling this elsewhere will "stack" not overwrite
     * @public
     * @method
     *
     * @param {string} up - up direction movement key code
     * @param {string} down - down direction movement key code
     * @param {string} left - left direction movement key code
     * @param {string} right - right direction movement key code
     */
    registerMovementInput = (
        up = "ArrowUp",
        down = "ArrowDown",
        left = "ArrowLeft",
        right = "ArrowRight"
    ) => {
        window.addEventListener("keydown", (e) => {
            switch (e.code) {
                case up:
                    queueDir("up");
                    break;
                case down:
                    queueDir("down");
                    break;
                case left:
                    queueDir("left");
                    break;
                case right:
                    queueDir("right");
                    break;
                default:
                    break;
            }
            this._handleMovementInput();
        });
        window.addEventListener("keyup", (e) => {
            switch (e.code) {
                case up:
                    unQueueDir("up");
                    break;
                case down:
                    unQueueDir("down");
                    break;
                case left:
                    unQueueDir("left");
                    break;
                case right:
                    unQueueDir("right");
                    break;
                default:
                    break;
            }
            this._handleMovementInput();
        });

        /** @param {Direction} dir - direction associated with the pressed key */
        const queueDir = (dir) => {
            if (!this.queuedDirections.includes(dir)) {
                this.queuedDirections.unshift(dir);
            }
        };
        /**  @param {Direction} dir - direction associated with the pressed key */
        const unQueueDir = (dir) => {
            if (this.queuedDirections.includes(dir)) {
                this.queuedDirections = this.queuedDirections.filter((e) => e !== dir);
            }
        };
    };

    /**
     * Handles new player creation, avoids creating duplicates
     * @static
     * @method
     *
     * @param {UserStore} playerData
     * @returns {Promise<PlayerSelf>} - returns the player instance or false
     */
    static createPlayer = async (playerData) => {
        const spriteSheet = await loadPlayerSprite();

        return new PlayerSelf(spriteSheet, playerData);
    };
}

export default PlayerSelf;
