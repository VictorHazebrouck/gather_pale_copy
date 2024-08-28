/**
 * @module
 * @ignore
 */

import { Spritesheet, Sprite, Container, Assets } from "pixi.js";

import tilemap from "./tilemap.json";
import spriteData from "../../assets/backgroundSpritesheet.json";

/**
 * Player class that extends AnimatedSprite.
 *
 * @category GAME
 * @subcategory LAYERS
 * @extends Container
 */
class Walls extends Container {
    constructor() {
        super();
        this.spriteData = spriteData;
        this.tileMap = tilemap;
        this.zIndex = 2;
    }

    async generateWalls() {
        this.rawSpritesheet = await Assets.load("assets/Tiles/topDown_baseTiles.png");

        const spriteSheet = new Spritesheet(this.rawSpritesheet, this.spriteData);
        await spriteSheet.parse();

        const TILE_SIZE = 16;
        const width = this.tileMap[0].length * TILE_SIZE;
        const height = this.tileMap.length * TILE_SIZE;
        this.height = height;
        this.width = width;

        //create the map from a matrix
        for (let i = 0; i < this.tileMap.length; i++) {
            for (let j = 0; j < this.tileMap[i].length; j++) {
                if (!this.tileMap[i][j]) continue;

                console.log("hahah", this.tileMap[i][j]);
                /** @todo find a proper way to handle this mess */
                // @ts-ignore
                const texture = spriteSheet.textures[`${this.tileMap[i][j]}.png`];

                const sprite = new Sprite(texture);
                sprite.position.set(j * TILE_SIZE, i * TILE_SIZE);
                this.addChild(sprite);
            }
        }
    }
}

export default Walls;
