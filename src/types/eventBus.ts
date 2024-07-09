/** List of all event names with their corresponding data to be passsed around */
type EventTypes = {
    newPlayerConnected: any;
    connectionData: any;
    newPlayerMove: any;
    playerDisconnected: any;
    chatMessageReceived: any;
    sendChatMessage: any;
    move: any;
    nameChanged: any;
    aNameHasChanged: any;
    playerClick: any;
};

type Listener<T> = (data: T) => void;

export interface EventBus {
    /**
     * The list of subscribed events
     * @private
     */
    _listeners: Record<string, Listener<any>[]>;

    /**
     * Subscribe a callback function to an event.
     *
     * @param event - The event name.
     * @param listener - The callback function to handle the event.
     */
    subscribe<E extends keyof EventTypes>(event: E, listener: Listener<EventTypes[E]>): void;

    /**
     * Unsubscribe a callback function from an event.
     *
     * @param event - The event name.
     * @param listener - The callback function to handle the event.
     */
    unsubscribe<E extends keyof EventTypes>(event: E, listener: Listener<EventTypes[E]>): void;

    /**
     * Publish an event.
     *
     * @param event - The event name.
     * @param listener - The data being shared to subscribers
     */
    publish<E extends keyof EventTypes>(event: E, data: EventTypes[E]): void;
}
