import { Message } from "discord.js";
import { default as CookiecordClient, listener, Module } from "../../src";

export default class ReferencedModule extends Module {
    constructor(client: CookiecordClient, public readonly data: number) {
        super(client);
    }
    @listener({ event: "ready" })
    onMessage(msg: Message) {
        console.log("referencedModule ready", this.data);
    }
}
