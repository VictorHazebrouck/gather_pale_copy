import { Spritesheet, Sprite, Container, Assets } from "pixi.js";

import tilemap from "./tilemap.json";
import spriteData from "../../assets/Tiles/spritesheet.json";
const rawSpritesheet = await Assets.load("/src/game/assets/Tiles/topDown_baseTiles.png");

class Background extends Container {
    constructor() {
        super();
        this.rawSpritesheet = rawSpritesheet;
        this.spriteData = spriteData;
        this.tileMap = tilemap;
    }

    async generateBackground() {
        const spriteSheet = new Spritesheet(this.rawSpritesheet, this.spriteData);
        await spriteSheet.parse();

        const tileSize = 16;
        const width = this.tileMap[0].length * tileSize;
        const height = this.tileMap.length * tileSize;
        this.height = height;
        this.width = width;

        //create the map from a matrix
        for (let i = 0; i < this.tileMap.length; i++) {
            for (let j = 0; j < this.tileMap[i].length; j++) {
                /** @todo find a proper way to handle this mess */
                // @ts-ignore
                const texture = spriteSheet.textures[`${this.tileMap[i][j]}.png`];
                const sprite = new Sprite(texture);
                sprite.position.set(j * tileSize, i * tileSize);
                this.addChild(sprite);
            }
        }
    }
}

export default Background;
