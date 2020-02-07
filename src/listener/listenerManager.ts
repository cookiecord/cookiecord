import { Listener } from ".";
import CookiecordClient from "../client";

export default class ListenerManager {
    listeners: Set<Listener> = new Set();
    client: CookiecordClient;
    constructor(client: CookiecordClient) {
        this.client = client;
    }
    add(listener: Listener) {
        if (this.listeners.has(listener)) return;

        const conflictingListener = Array.from(this.listeners).find(
            l => l.id == listener.id
        );
        if (conflictingListener) {
            throw new Error(
                `Cannot add ${listener.id} because it would conflict with ${conflictingListener.id}.`
            );
        }
        listener.wrapperFunc = (...args: any[]) =>
            listener.func.apply(listener.module, args);
        this.listeners.add(listener);
        this.client.on(listener.event, listener.wrapperFunc);
    }
    remove(listener: Listener) {
        if (listener.wrapperFunc)
            this.client.removeListener(listener.event, listener.wrapperFunc);
        this.listeners.delete(listener);
    }
}
