import tileMap from "./zonesdef.json";

/**
 * @typedef {object} ZoneType
 * @property {string} name - name of the zone
 * @property {boolean} isGlobalCommunication - whether to disable proximity chat
 * @property {Bounds} bounds - the position definition of the zone, must always be a rectangle
 */

/**
 * @typedef {object} Bounds
 * @property {number} xMin
 * @property {number} yMin
 * @property {number} xMax
 * @property {number} yMax
 */

class Zones {
    /** @param {import('../Layers').default} layers */
    constructor(layers) {
        /** @type {ZoneType} */
        this.default = {
            name: "global zone",
            isGlobalCommunication: false,
            bounds: {
                xMin: 0,
                yMin: 0,
                xMax: 9999,
                yMax: 9999,
            },
        };
        /** @type {ZoneType[]} */
        this.zoneDefs = [];
        this.init();
        this.layers = layers;
    }
    init() {
        this.zoneDefs = tileMap;
        console.log(tileMap);
    }
}

export default Zones;
