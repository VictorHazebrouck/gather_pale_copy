import Alpine from "alpinejs";
// @ts-ignore
import persist from "@alpinejs/persist";
import { Component } from "./plugins";

/** Register plugins before binding datas and stores */
Alpine.plugin(persist);
Alpine.plugin(Component);

//@ts-ignore
window.Alpine = Alpine;

export default Alpine;
