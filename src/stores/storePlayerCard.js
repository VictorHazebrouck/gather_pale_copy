import Alpine from "alpinejs";

/** @type {PlayerCardStore} */
export default {
    x: 0,
    y: 0,
    userId: "",
    userName: "",
    isCardVisible: false,

    showCard({ userId, userName }, position) {
        this.x = position.x;
        this.y = position.y;
        this.userId = userId;
        this.userName = userName;

        this.isCardVisible = true;
    },
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
};
