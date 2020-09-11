import { Message } from "discord.js";
import { command, default as CookiecordClient, Module } from "../../src";

export default class Dummy2Module extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }
    @command()
    dummy2(msg: Message) {}
}
