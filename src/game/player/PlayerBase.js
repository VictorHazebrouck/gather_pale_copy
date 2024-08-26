/**
 * @module
 * @ignore
 */
import { Spritesheet, AnimatedSprite, Ticker, Point } from "pixi.js";
import NameTag from "./NameTag";
import eventBus from "../../EventBus";
import Layers from "../layers/Layers";
import { getZoneFromPosition } from "./utils/proximityStuff";

/**
 * Player class that extends AnimatedSprite.
 *
 * @category GAME
 * @subcategory PLAYER
 */
class PlayerBase extends AnimatedSprite {
    /**
     * @constructor
     *
     * @param {PlayerDataWithCoordinates} playerData - data required to initialize player
     * @param {Spritesheet} spriteSheet - data required to initialize player
     * @param {Layers} layers
     */
    constructor({ userId, userName, x, y }, spriteSheet, layers) {
        super(spriteSheet.animations["idle"]);
        this.spriteSheet = spriteSheet;
        this.layers = layers;

        /** @type {PlayerData} */
        this.playerInformation = {
            userId: userId,
            userName: userName,
        };

        this.position.x = x;
        this.position.y = y;

        /** @constant */
        this.anchor.set(0.5, 0.5);
        /** @constant */
        this.animationSpeed = 0.1;
        /** @constant */
        this.speed = 2;

        /** @type {Direction} */
        this.moveDirection = "stop";

        Ticker.shared.add(this._spriteUpdate);
        this._createNameTag({ userId, userName });
        this._startZoneDetectionLoop();
    }

    /**
     * Called on each new frame to update the animation of the player according to its current moveDirection.
     * @private
     * @method
     *
     * @returns {void}
     */
    _spriteUpdate = () => {
        //early exit for the most frequently present case
        if (this.moveDirection === "stop") {
            this.stop();
            return;
        }

        switch (this.moveDirection) {
            case "up":
                // @ts-ignore
                if (this.textures[0].uid !== this.spriteSheet.animations["move_back"][0].uid) {
                    this.textures = this.spriteSheet.animations["move_back"];
                }
                break;
            case "down":
                // @ts-ignore
                if (this.textures[0].uid !== this.spriteSheet.animations["move_front"][0].uid) {
                    this.textures = this.spriteSheet.animations["move_front"];
                }
                break;
            case "left":
                // @ts-ignore
                if (this.textures[0].uid !== this.spriteSheet.animations["move_left"][0].uid) {
                    this.textures = this.spriteSheet.animations["move_left"];
                }
                break;
            case "right":
                // @ts-ignore
                if (this.textures[0].uid !== this.spriteSheet.animations["move_right"][0].uid) {
                    this.textures = this.spriteSheet.animations["move_right"];
                }
                break;
            default:
                break;
        }
        this.play();
    };

    /**
     * Moves player smoothly towards a specific directions, to be called on a game-loop
     * @public
     * @method
     *
     * @param {Ticker} Ticker Info about game loop, time passed since last frame update
     * @param {Direction} direction - direction in which to move the player
     */
    movePlayer = ({ deltaTime }, direction) => {
        switch (direction) {
            case "up":
                this.position.y -= this.speed * deltaTime;
                break;
            case "down":
                this.position.y += this.speed * deltaTime;
                break;
            case "left":
                this.position.x -= this.speed * deltaTime;
                break;
            case "right":
                this.position.x += this.speed * deltaTime;
                break;
            default:
                break;
        }
    };

    /**
     * Self explainatory anough i guess
     * @public
     * @method
     *
     * @param {Direction} direction - instructed direction
     * @param {import("pixi.js").Sprite} object - PIXI sprite that must contain "position" && "bounds" properties
     * @returns {boolean} returns true if player has collided
     */
    hasCollided = (direction, object) => {
        const margin = 2;

        /** Calculate bounds of the player */
        const playerBounds = {
            left: this.x + this.bounds.minX,
            right: this.x + this.bounds.maxX,
            top: this.y + this.bounds.minY,
            bottom: this.y + this.bounds.maxY,
        };

        /** Calculate bounds of the object */
        const objectBounds = {
            left: object.x + object.bounds.minX,
            right: object.x + object.bounds.maxX,
            top: object.y + object.bounds.minY,
            bottom: object.y + object.bounds.maxY,
        };

        //switch for smoother movement and separate margin application to each direction,
        //avoiding player getting stuck on perpendicular movement change after colliding
        switch (direction) {
            case "up":
                if (
                    playerBounds.top < objectBounds.bottom &&
                    playerBounds.top > objectBounds.top &&
                    playerBounds.right > objectBounds.left + margin &&
                    playerBounds.left < objectBounds.right - margin
                ) {
                    return true;
                }
                break;
            case "down":
                if (
                    playerBounds.bottom > objectBounds.top &&
                    playerBounds.bottom < objectBounds.bottom &&
                    playerBounds.right > objectBounds.left + margin &&
                    playerBounds.left < objectBounds.right - margin
                ) {
                    return true;
                }
                break;
            case "left":
                if (
                    playerBounds.left < objectBounds.right &&
                    playerBounds.left > objectBounds.left &&
                    playerBounds.bottom > objectBounds.top + margin &&
                    playerBounds.top < objectBounds.bottom - margin
                ) {
                    return true;
                }
                break;
            case "right":
                if (
                    playerBounds.right > objectBounds.left &&
                    playerBounds.right < objectBounds.right &&
                    playerBounds.bottom > objectBounds.top + margin &&
                    playerBounds.top < objectBounds.bottom - margin
                ) {
                    return true;
                }
                break;
            default:
                break;
        }

        return false;
    };

    _startZoneDetectionLoop() {
        setInterval(() => {
           const zone =  getZoneFromPosition(this.layers.zones, this.position);
           //console.log("player in zone: ", ha);
        }, 500);
    }

    /**
     * Function to get position of the player
     * @public
     * @method
     *
     * @returns {import("pixi.js").Point} - Returns the screen position of the player relative to the canva
     */
    getScreenPosition = () => {
        const globalPosition = this.toGlobal(new Point(0, 0));
        return globalPosition;
    };

    /**
     * Function to handle creating and updating name tag
     * @private
     * @method
     *
     * @param {PlayerData} data
     */
    _createNameTag({ userId, userName }) {
        let nameTag = new NameTag({ userId, userName });
        this.addChild(nameTag);

        eventBus.subscribe("receive_username_change", (data) => {
            if (data.userId === userId) {
                this.playerInformation.userName = data.newName;
                nameTag.destroy();
                nameTag = new NameTag({ userId, userName: data.newName });
                this.addChild(nameTag);
            }
        });
    }
}

export default PlayerBase;
