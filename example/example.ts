import {
    command,
    Module,
    listener,
    default as CookiecordClient,
    getUserPermission,
    getMemberPermission
} from "../src";
import { Message, GuildMember, User } from "discord.js";
import { Permission } from "../src";

export default class ExampleModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }

    @command({ description: "asd" })
    test(msg: Message, a: string, b: number, u: User, m: GuildMember) {
        msg.reply(a + b + u.tag + m.nickname);
    }

    @command({ description: "abc", aliases: ["gc"] })
    guildcount(msg: Message, offset: number) {
        msg.reply(this.client.guilds.size + offset);
    }

    @listener({ event: "message" })
    onTest(msg: Message) {
        console.log("onTest", msg.content);
    }

    @command({ description: "pong" })
    ping(msg: Message) {
        msg.reply("Pong. :ping_pong:");
    }
    @command({
        permission: Permission.GUILD_MOD,
        description: "Checking if user is mod or higher"
    })
    modcheck(msg: Message) {
        if (!msg.member) return;
        msg.reply(
            `permission = ${getMemberPermission(this.client, msg.member)}`
        );
    }
    @command({
        description: "one big string for all of the args",
        single: true
    })
    single(msg: Message, str: string) {
        msg.reply("You said " + str);
    }
}
