import { Assets, Spritesheet, AnimatedSprite, Ticker, Point } from "pixi.js";
import spriteData from "../assets/Characters/spritesheet.json";

const rawSpritesheet = await Assets.load("/src/game/assets/Characters/spr_alex.png");
const spriteSheet = new Spritesheet(rawSpritesheet, spriteData);
await spriteSheet.parse();

class Player extends AnimatedSprite {
    /** @param {PlayerData } playerData - data required to initialize player */
    constructor({ userId, userName }) {
        super(spriteSheet.animations["idle"]);

        /** @type {PlayerData} */
        this.playerInformation = {
            userId: userId,
            userName: userName,
        };

        this.anchor.set(0.5, 0.5);

        Ticker.shared.add(this._spriteUpdate);
    }
    animationSpeed = 0.1;
    speed = 2;
    /** @type {Direction} */
    moveDirection = "stop";

    /**
     * Called on each new frame to update the animation of the player according to its current moveDirection.
     * @private
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
                if (this.textures[0].uid !== spriteSheet.animations["move_back"][0].uid) {
                    this.textures = spriteSheet.animations["move_back"];
                }
                break;
            case "down":
                // @ts-ignore
                if (this.textures[0].uid !== spriteSheet.animations["move_front"][0].uid) {
                    this.textures = spriteSheet.animations["move_front"];
                }
                break;
            case "left":
                // @ts-ignore
                if (this.textures[0].uid !== spriteSheet.animations["move_left"][0].uid) {
                    this.textures = spriteSheet.animations["move_left"];
                }
                break;
            case "right":
                // @ts-ignore
                if (this.textures[0].uid !== spriteSheet.animations["move_right"][0].uid) {
                    this.textures = spriteSheet.animations["move_right"];
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

    /**
     * Function to get position of the player
     * @public
     *
     * @returns {import("pixi.js").Point} - Returns the screen position of the player relative to the canva
     */
    getScreenPosition = () => {
        const globalPosition = this.toGlobal(new Point(0, 0));
        return globalPosition;
    };
}

export default Player;
