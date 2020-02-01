import Module from "../module";
import CookiecordClient from "../client";
import { listener } from "../listener";
import { Message, MessageMentions } from "discord.js";
export type ArgTypes = {
    [key: string]: (s: string, msg: Message) => unknown;
};
const USER_PATTERN = /<@!?(\d+)>/;

export default class CommandParserModule extends Module {
    private types: ArgTypes;
    constructor(client: CookiecordClient) {
        super(client);
        this.types = {
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
        this.types = Object.assign(this.types, this.client.commandArgumentTypes);
        this.client = client;
    }
    @listener({ event: "message" })
    async onMessage(msg: Message) {
        const prefix = this.client.commandPrefix;
        if (msg.author && msg.author.bot) return;
        if (!msg.content.startsWith(prefix)) return;
        const noPrefix = msg.content.replace(prefix, "");
        const stringArgs: string[] = noPrefix.split(" ").slice(1) || [];
        const cmdTrigger = noPrefix.split(" ")[0];
        const cmd = this.client.getCommandByTrigger(cmdTrigger);
        if (!cmd || !msg.author) return;
        
        for (const inhibitor of cmd.inhibitors) {
            const reason = await inhibitor(msg, this.client);
            if (reason) {
                // It inhibited
                msg.reply(`:warning: command was inhibited: ${reason}`);
                return;
            }
        }

        const typedArgs = [] as unknown[];
        if (cmd.single) {
            typedArgs.push(stringArgs.join(" "));
        } else {
            if (stringArgs.length !== cmd.types.length)
                return msg.reply(
                    `:warning: expected ${cmd.types.length} arguments but got ${stringArgs.length} arguments instead`
                );
            for (const i in stringArgs) {
                const sa = stringArgs[i];
                if (!this.types[cmd.types[i].name])
                    return msg.reply(
                        `:warning: command tried to use an unsupported argument type ${cmd.types[i].name}`
                    );
                const arg = this.types[cmd.types[i].name](sa, msg);
                if (arg === null || arg === undefined) {
                    return msg.reply(
                        `:warning: argument #${parseInt(i, 10) +
                            1} is not of expected type ${cmd.types[i].name}`
                    );
                } else typedArgs.push(arg);
            }
        }
        cmd.func.call(cmd.module, msg, ...typedArgs);
    }
}
