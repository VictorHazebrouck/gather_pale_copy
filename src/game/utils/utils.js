import { Spritesheet, Assets } from "pixi.js";
import Player from "../player/Player";
import PlayerOther from "../player/PlayerOther";

import spriteData from "../assets/characterSpritesheet.json";

async function loadPlayerSprite() {
    const rawSpritesheet = await Assets.load("assets/Characters/spr_alex.png");
    const spriteSheet = new Spritesheet(rawSpritesheet, spriteData);
    await spriteSheet.parse();
    return spriteSheet;
}

/**
 * Util function to check if an object is an instance of PlayerOther
 * @param {any} object - game container childs
 * @returns {object is Player} - returns whether the object is of type PlayerOther
 */
function isPlayer(object) {
    return object instanceof Player;
}

/**
 * Util function to check if an object is an instance of PlayerOther
 * @param {any} object - game container childs
 * @returns {object is PlayerOther} - returns whether the object is of type PlayerOther
 */
function isPlayerOther(object) {
    return object instanceof PlayerOther;
}

export { isPlayer, isPlayerOther, loadPlayerSprite };
