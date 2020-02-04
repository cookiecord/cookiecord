import { Message } from "discord.js";
import { command, default as CookiecordClient, Module } from "../src";

class PingModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }

    @command({})
    ping(msg: Message) {
        msg.reply("Pong. :ping_pong:");
    }
}

new CookiecordClient().registerModule(PingModule).login(process.env.TOKEN);
