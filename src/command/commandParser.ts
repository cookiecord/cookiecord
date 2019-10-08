import Module from "../module";
import CookiecordClient from "../client";
import { listener } from "../listener";
import { Message, MessageMentions } from "discord.js";
type ArgType = {
    [key: string]: (s: string, msg: Message) => unknown;
};
const USER_PATTERN = /<@!?(\d+)>/;
const types: ArgType = {
    Number: (s) => (isNaN(parseFloat(s)) ? null : parseFloat(s)),
    String: (s) => s,
    User: (s, msg) => {
        const res = USER_PATTERN.exec(s);
        if (!res) return;
        return msg.client.users.get(res[1]);
    },
    GuildMember: (s, msg) => {
        const res = USER_PATTERN.exec(s);
        if (!res || !msg.guild) return;
        return msg.guild.members.get(res[1]);
    }
};

export default class CommandParserModule extends Module {
    public client: CookiecordClient;
    constructor(client: CookiecordClient) {
        super(client);
        // console.log(client);
        this.client = client;
    }
    @listener({ event: "message" })
    onMessage(msg: Message) {
        const prefix = "cc!";
        if (msg.author && msg.author.bot) return;
        if (!msg.content.startsWith(prefix)) return;
        const noPrefix = msg.content.replace(prefix, "");
        const stringArgs: string[] = noPrefix.split(" ").slice(1) || [];
        const cmdTrigger = noPrefix.split(" ")[0];
        const cmd = this.client.commandManager.cmds.find((c) =>
            c.triggers.includes(cmdTrigger)
        );
        if (!cmd) return;
        if (stringArgs.length !== cmd.types.length)
            return msg.reply(
                `expected ${cmd.types.length} arguments but got ${stringArgs.length} arguments instead`
            );
        const typedArgs = [] as unknown[];
        for (const i in stringArgs) {
            const sa = stringArgs[i];
            if (!types[cmd.types[i].name])
                return msg.reply(
                    `command tried to use an unsupported argument type ${cmd.types[i].name}`
                );
            const arg = types[cmd.types[i].name](sa, msg);
            if (arg === null || arg === undefined) {
                return msg.reply(
                    `argument #${parseInt(i, 10) +
                        1} is not of expected type ${cmd.types[i].name}`
                );
            } else typedArgs.push(arg);
        }

        cmd.func.call(cmd.module, msg, ...typedArgs);
    }
}
