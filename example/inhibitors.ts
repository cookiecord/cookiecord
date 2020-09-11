import { Message } from "discord.js";
import {
    command,
    default as CookiecordClient,
    Module,
    CommonInhibitors
} from "../src";

class InhibitorsModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }

    @command({ inhibitors: [CommonInhibitors.botAdminsOnly] })
    supersecret(msg: Message) {
        msg.reply(
            "The bot's token starts with: " + this.client.token?.slice(0, 2)
        );
    }

    @command({
        inhibitors: [
            async (msg) =>
                msg.author.username.toLowerCase().includes("cookie")
                    ? undefined
                    : "username must include cookie"
        ]
    })
    custominhibitor(msg: Message) {
        msg.reply(
            "Your username has cookie in it! Have a cookie: https://cdn.discordapp.com/avatars/142244934139904000/0db321441968e15b0ee25224746d6bff.png"
        );
    }
}

new CookiecordClient({
    commandArgumentTypes: { Date: (s) => new Date(s) },
    botAdmins: process.env.BOT_ADMINS?.split(",")
})
    .registerModule(InhibitorsModule)
    .login(process.env.TOKEN);
