import Alpine from "alpinejs";
import EventBus from "../EventBus";

/** @type {PlayerCardStore} */
export default {
    x: 0,
    y: 0,
    userId: "",
    userName: "",
    isCardVisible: false,

    hideCard() {
        this.isCardVisible = false;
    },
    sendMessage() {
        const obj = {
            userName: this.userName,
            userId: this.userId,
        };
        Alpine.store("chat").newRoom(obj);
    },
    init() {
        EventBus.subscribe("playerClick", ({ position, playerInformation }) => {
            this.x = position.x;
            this.y = position.y;
            this.userId = playerInformation.userId;
            this.userName = playerInformation.userName;
            this.isCardVisible = true;
        });
    },
};

/**
 * Represents a card manager configuration object.
 *
 * @typedef {object} PlayerCardStore
 * @property {number} x - The x-coordinate position of the card relative to the game canvas.
 * @property {number} y - The y-coordinate position of the card relative to the game canvas.
 * @property {string} userId - The user ID associated with the card.
 * @property {string} userName - The user name associated with the card.
 * @property {boolean} isCardVisible - Indicates if the card is visible.
 * @property {function(): void} hideCard - Hides the card.
 * @property {function(): void} sendMessage - Sends a message using user details via Alpine store.
 * @property {function(): void} init - Sends a message using user details via Alpine store.
 */
