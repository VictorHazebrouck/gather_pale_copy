import DB from "../db/DB";
import Alpine from "alpinejs";
import EventBus from "../EventBus";

/** @type {UtilsStore} */
export default {
    isSidePannelVisible: true,
    sidePannerSelected: "chat",
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

        EventBus.publish("initiate_username_change", { newName });
        Alpine.store("user").userName = newName;

        //@ts-ignore
        this.$data.input = "";
    },
};
