import Alpine from "alpinejs";
import { v4 as uuidv4 } from "uuid";

/** @type {UserStore} */
export default {
    userName: Alpine.$persist("Steve"),
    userId: Alpine.$persist(uuidv4()),
    lastPositionY: Alpine.$persist(0),
    lastPositionX: Alpine.$persist(0),
};
