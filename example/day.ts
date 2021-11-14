import { Message } from "discord.js";
import { command, default as CookiecordClient, Module } from "../src";

class DayModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }

    @command()
    day(msg: Message, d: Date) {
        msg.reply("The day of the week is: " + d.getDay());
    }
}

new CookiecordClient({
    commandArgumentTypes: { Date: s => new Date(s) },
    prefix: "!"
})
    .registerModule(DayModule)
    .login(process.env.TOKEN);
