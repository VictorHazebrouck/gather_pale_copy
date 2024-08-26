/**
 * @module
 * @ignore
 */
import { Ticker, Spritesheet } from "pixi.js";
import PlayerBase from "./PlayerBase";
import Alpine from "alpinejs";
import { filterPlayerOthers, loadPlayerSprite } from "./utils/utils";
import eventBus from "../../EventBus";
import Layers from "../layers/Layers";

/**
 * PlayerSelf class that extends PlayerBase.
 *
 * @category GAME
 * @subcategory PLAYER
 */
class PlayerSelf extends PlayerBase {
    /**
     * @constructor
     * @private
     *
     * @param {Spritesheet} spriteSheet - spritesheet
     * @param {PlayerDataWithCoordinates} playerData - player data
     * @param {Layers} layers
     */
    constructor(spriteSheet, playerData, layers) {
        super(playerData, spriteSheet);

        /**@type {Map<string, string>} */
        this.nearbyPlayers = new Map();
        this.layers = layers;

        Ticker.shared.add(this._playerMovement);
        this._checkNearbyPlayers();
    }

    /**
     * Used together with @see {moveDirection} to detect a change in requested direction
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
        if (this.moveDirection === "stop") {
            return;
        }

        const collidableObjects = [
            ...filterPlayerOthers(this.layers.playersLayer?.children|| []),
            ...this.layers.walls?.children || [],
        ];

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

                eventBus.publish("initiate_move_instructions", obj);

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
        eventBus.publish("initiate_move_instructions", obj);
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
     * Handles nearby players detection
     * fires player join and player leave nearby events
     * @private
     * @method
     *
     * @returns {void}
     */
    _checkNearbyPlayers = () => {
        setInterval(() => {
            const otherPlayers = filterPlayerOthers(this.parent.children);

            for (const player of otherPlayers) {
                const { x, y } = player.position;
                const a = Math.abs(this.x - x);
                const b = Math.abs(this.y - y);
                const distance = Math.sqrt(a * a + b * b);

                const { userId, userName } = player.playerInformation;

                if (distance < 100) {
                    if (!this.nearbyPlayers.has(userId)) {
                        this.nearbyPlayers.set(userId, userName);
                        eventBus.publish("game_player_join_nearby_area", {
                            userId: userId,
                            userName: userName,
                        });
                    }
                } else {
                    if (this.nearbyPlayers.has(userId)) {
                        this.nearbyPlayers.delete(userId);
                        eventBus.publish("game_player_leave_nearby_area", { userId: userId });
                    }
                }
            }
        }, 500);

        eventBus.subscribe("player_disconnected", (data) => this.nearbyPlayers.delete(data.userId));
    };

    /**
     * Handles new player creation, avoids creating duplicates
     * @static
     * @method
     *
     * @param {UserStore} playerSelfData
     * @param {Layers} layers
     * @returns {Promise<PlayerSelf>} - returns the player instance or false
     */
    static createPlayer = async (playerSelfData, layers) => {
        const spriteSheet = await loadPlayerSprite();

        /** @type {PlayerDataWithCoordinates} */
        const obj = {
            userId: playerSelfData.userId,
            userName: playerSelfData.userName,
            x: playerSelfData.lastPositionX,
            y: playerSelfData.lastPositionY,
        };

        return new PlayerSelf(spriteSheet, obj, layers);
    };
}

export default PlayerSelf;
