import Alpine from "alpinejs";
// @ts-ignore
import persist from "@alpinejs/persist";

/** Register plugins before binding datas and stores */
Alpine.plugin(persist);
//@ts-ignore
window.Alpine = Alpine;

export default Alpine;
