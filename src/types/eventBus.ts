/** List of all event names with their corresponding data to be passsed around */
type EventTypes = {
    newPlayerConnected: NewPlayerConnectedEventData;
    connectionData: ConnectionDataEventData;
    newPlayerMove: NewPlayerMoveEventData;
    playerDisconnected: PlayerDisconnectdEventData;
    chatMessageReceived: ChatMessageReceivedEventData;
    sendChatMessage: SendChatMessageEventData;
    move: MoveEventData;
    nameChanged: NameChangedEventData;
    aNameHasChanged: ANameHasChangedEventData;
    playerClick: PlayerClickEventData;
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
