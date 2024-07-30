import Alpine from "alpinejs";
import EventBus from "../EventBus";

/** @type {UtilsStore} */
export default {
    isSidePannelVisible: true,
    sidePannerSelected: Alpine.$persist("chat"),
    closeSidePannel() {
        this.isSidePannelVisible = false;
    },
    openSidePannel(pannel = "") {
        this.isSidePannelVisible = true;
        this.sidePannerSelected = pannel;
    },
    resetDB() {},
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
