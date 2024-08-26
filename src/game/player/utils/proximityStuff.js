import Zones from "../../layers/zones/Zones";
import PlayerSelf from "../PlayerSelf";

/**
 * Returns in which zone a players belongs according to its current position
 * 
 * @param {Zones} zones 
 * @param {PlayerSelf["position"]} position 
 */
export function getZoneFromPosition(zones, position){
    for(const zone of zones.zoneDefs){
        const {x, y} = position

        if(
            x < zone.bounds.xMax &&
            x > zone.bounds.xMin &&
            y < zone.bounds.yMax &&
            y > zone.bounds.yMin
         ){
            return zone
         }
    }
    return zones.default
}