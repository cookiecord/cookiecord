import { Listener } from ".";
import CookiecordClient from "../client";
import { inspect } from "util";

export default class ListenerManager {
	listeners: Listener[];
	client: CookiecordClient;
    constructor(client: CookiecordClient) {
		this.listeners = [];
		this.client = client;
    }
    add(listener: Listener) {
        if (this.listeners.includes(listener)) return;
        const conflictingListener = this.listeners.find(l => l.id == listener.id);
        if (conflictingListener) {
            throw new Error(
				`Cannot add ${listener.id} because it would conflict with ${conflictingListener.id}.`
            );
		}
		// console.log(listener)
		this.listeners.push(listener);
		// console.log(inspect(listener,false,1,true))
		this.client.on(listener.event, (...args: any[]) => listener.func.apply(listener.module, args));
		// this.client.on(listener.event, (...args: any[]) => console.log("Hai"));
	}
    remove(listener: Listener) {
        delete this.listeners[this.listeners.findIndex((l) => l == listener)];
    }
}
