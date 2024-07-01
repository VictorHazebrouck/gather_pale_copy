import Player from "../player/Player";
import PlayerOther from "../player/PlayerOther";

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

export { isPlayer, isPlayerOther };
