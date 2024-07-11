/** 
 * @module
 * @category GAME
 */

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
 * @param {any[]} arr - game container childs
 * @returns {Player[]} - returns array of type Player
 */
function filterPlayers(arr) {
    return arr.filter((e) => e instanceof Player);
}

/**
 * Util function to check if an object is an instance of PlayerOther
 * @param {any[]} arr - game container childs
 * @returns {PlayerOther[]} - returns array of type PlayerOther
 */
function filterPlayerOthers(arr) {
    return arr.filter((e) => e instanceof PlayerOther);
}

export { filterPlayers, filterPlayerOthers, loadPlayerSprite };
