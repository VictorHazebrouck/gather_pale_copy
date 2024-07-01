declare module "alpinejs" {
    interface Alpine {
        plugin(fn: Function): void;
        $persist<T>(initialValue: T): T;
        $data: object;
        store<T>(name: string, value: T): T;
        data<T>(name: string, value: T): T;
        start: Function;

        /**
         * custom globally availabe stores types,
         * getters and setters having the same method name, its the only way I found to type those
         */
        store(name: "chat"): ChatStore;
        store(name: "user"): UserStore;
        store(name: "utils"): UtilsStore;
        store(name: "playerCard"): PlayerCardStore;
    }

    const Alpine: Alpine;
    export default Alpine;
}
