import { Message } from "discord.js";
import { default as CookiecordClient, listener, Module } from "../../src";

export default class AnotherExampleModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }
    @listener({ event: "message" })
    onMessage(msg: Message) {
        console.log("anotherModule onMessage", msg.content);
    }
}
