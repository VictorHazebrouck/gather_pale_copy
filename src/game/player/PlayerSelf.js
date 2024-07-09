import { Ticker, Spritesheet } from "pixi.js";
import EventBus from "../../EventBus";
import Player from "./Player";
import Alpine from "alpinejs";
import PlayerOther from "./PlayerOther";
import { isPlayerOther, loadPlayerSprite } from "../utils/utils";

class PlayerSelf extends Player {
    /**
     * @param {Spritesheet} spriteSheet - spritesheet
     */
    constructor(spriteSheet) {
        /** @type {PlayerData} */
        const obj = {
            userId: Alpine.store("user").userId,
            userName: Alpine.store("user").userName,
        };
        super(obj, spriteSheet);

        this.position.x = Alpine.store("user").lastPositionX;
        this.position.y = Alpine.store("user").lastPositionY;

        this.zIndex = 10;
        Ticker.shared.add(this._playerMovement);
    }

    /**
     * @type {Direction[]}
     *
     * Used together with "moveDirection" to detect a change in requested direction
     * Keeps track multiple key pressed at the same time while only allowing for strict x||y movement
     */
    queuedDirections = [];

    /**
     * Called on each frame to update the position of the player according to its current moveDirection.
     * @private
     *
     * @param {Ticker} ticker - time passed since last frame, used for consistent speed.
     * @returns {void}
     */
    _playerMovement = (ticker) => {
        /** Don't perform further calculations if player is stopped */
        if (this.moveDirection === "stop") {
            return;
        }

        /** @type {PlayerOther[]} */
        const collidableObjects = this.parent.children.filter(isPlayerOther);

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

                EventBus.publish("move", obj);

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
        EventBus.publish("move", obj);
    };

    /**
     * Adds event listeners for arrow keys, queues/removes directions instructions under queuedDirections
     * Initialized by the component itself to arrow keys, calling this elsewhere will "stack" not overwrite
     * @public
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
     *
     * @returns {Promise<PlayerSelf>} - returns the player instance or false
     */
    static createPlayer = async () => {
        const spriteSheet = await loadPlayerSprite();

        return new PlayerSelf(spriteSheet);
    };
}

export default PlayerSelf;
