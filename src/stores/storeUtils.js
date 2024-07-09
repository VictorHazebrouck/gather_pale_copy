import DB from "../db/init";
import Alpine from "alpinejs";
import EventBus from "../EventBus";

/** @type {UtilsStore} */
export default {
    isSidePannelVisible: true,
    sidePannerSelected: "chat",

    async Component(url = "") {
        const response = await fetch(`/ui/${url}.html`);
        const data = await response.text();
        return data;
    },
    async outterSwapComponent(url = "") {
        const response = await fetch(`/ui/${url}.html`);
        const data = await response.text();

        // @ts-ignore $el represents the dom element on which the fn is being called
        this.$el.outerHTML = data;
    },
    closeSidePannel() {
        this.isSidePannelVisible = false;
    },
    openSidePannel(pannel = "") {
        this.isSidePannelVisible = true;
        this.sidePannerSelected = pannel;
    },
    resetDB() {
        DB.deleteDB();
        Alpine.store("chat").rooms = [];
    },
    changeName(newName = "") {
        if (!newName) {
            return;
        }

        EventBus.publish("nameChanged", { newName });
        Alpine.store("user").userName = newName;

        //@ts-ignore
        this.$data.input = "";
    },
};
