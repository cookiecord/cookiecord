import { Message } from "discord.js";
import { command, default as CookiecordClient, Module } from "../../src";

export default class Dummy1Module extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }
    @command()
    dummy1(msg: Message) {}
}
