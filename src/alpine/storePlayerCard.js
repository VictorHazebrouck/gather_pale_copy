import Alpine from "alpinejs";
import eventBus from "../EventBus";
const containingCanvas = /** @type {HTMLDivElement} */ (document.querySelector("#container-game"));
const WIDTH = 200;
const HEIGHT = 200;
const MARGIN = 10;

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
        Alpine.store("utils").sidePannerSelected = "chat";
    },
    init() {
        eventBus.subscribe("game_player_clicked", ({ position, playerInformation }) => {
            const canvasRect = containingCanvas.getBoundingClientRect();
            const top = position.y;
            const bottom = position.y + HEIGHT;
            const right = position.x + WIDTH;
            const left = position.x;

            let x = position.x;
            if (canvasRect.right < right) x = canvasRect.right - WIDTH - MARGIN;
            if (canvasRect.left > left) x = canvasRect.left + MARGIN;

            let y = position.y;
            if (canvasRect.bottom < bottom) y = canvasRect.bottom + MARGIN;
            if (canvasRect.top > top) y = canvasRect.top + MARGIN;

            this.x = x;
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
