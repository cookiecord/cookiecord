import { Message } from "discord.js";
import CookiecordClient from "../client";
import { listener } from "../listener";
import Module from "../module";
import { getArgTypes } from "../util/argTypeProvider";

export default class CommandParserModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
        this.client = client;
    }
    @listener({ event: "message" })
    async onMessage(msg: Message) {
        const prefix = this.client.commandPrefix;
        if (msg.author && msg.author.bot) return;
        if (!msg.content.startsWith(prefix)) return;
        const noPrefix = msg.content.replace(prefix, "");
        const stringArgs: string[] = noPrefix.split(" ").slice(1) || [];
        const cmdTrigger = noPrefix.split(" ")[0].toLowerCase();
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

                const arg = getArgTypes(this.client)[cmd.types[i].name](
                    sa,
                    msg
                );
                if (arg === null || arg === undefined) {
                    return msg.reply(
                        `:warning: argument #${parseInt(i, 10) +
                            1} is not of expected type ${cmd.types[i].name}`
                    );
                } else typedArgs.push(arg);
            }
        }
        try {
            const result = cmd.func.call(cmd.module, msg, ...typedArgs);
            if (result instanceof Promise) {
                await result;
            }
        } catch (err) {
            console.error(
                `error while executing command ${cmd.id}! executed by ${msg.author.tag}/${msg.author.id} in guild ${msg.guild?.name}/${msg.guild?.id}\n`,
                err
            );
            cmd.onError(msg, err);
        }
    }
}
