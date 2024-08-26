import tileMap from "./zonesdef.json";

/**
 * @typedef {object} Zone
 * @property {string} name - name of the zone
 * @property {boolean} isGlobalCommunication - whether to disable proximity chat
 * @property {Bounds[]} bounds - the position definition of the zone, must always be a rectangle
 */

/**
 * @typedef {object} Bounds
 * @property {number} xMin
 * @property {number} yMin
 * @property {number} xMax
 * @property {number} yMax
 */

class Zones {
    constructor() {
        this.globalName = "global";
        /** @type {Zone[]} */
        this.zoneDefs = [];
        this.init();
    }
    init() {
        this.zoneDefs = tileMap;
        console.log(tileMap);
    }
}

export default Zones;
