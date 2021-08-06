import { Message } from "discord.js";
import CookiecordClient from "../client";
import listener from "../listener/decorator";
import Module from "../module";
import { getArgTypes } from "../util/argTypeProvider";
import { Context } from "..";

export default class CommandParserModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }
    @listener({ event: "message" })
    async onMessage(msg: Message) {
        if (msg.author && msg.author.bot) return;
        const prefix = await this.client.getPrefix(msg);
        if (Array.isArray(prefix) && prefix.length == 0) return;
        const matchingPrefix = Array.isArray(prefix)
            ? prefix.filter((x) => msg.content.startsWith(x))[0]
            : msg.content.startsWith(prefix)
            ? prefix
            : undefined;

        if (!matchingPrefix) return;

        const noPrefix = msg.content.replace(matchingPrefix, "");
        const stringArgs: string[] = noPrefix.split(" ").slice(1) || [];
        const cmdTrigger = noPrefix.split(" ")[0].toLowerCase();
        const cmd = this.client.commandManager.getByTrigger(cmdTrigger);
        if (!cmd) return;

        for (const inhibitor of cmd.inhibitors) {
            const reason = await inhibitor(msg, this.client);
            if (reason) {
                // It inhibited
                msg.reply(`:warning: command was inhibited: ${reason}`);
                return;
            }
        }
        // Argument type validation
        const typedArgs = [] as unknown[];
        if (cmd.single) {
            typedArgs.push(stringArgs.join(" "));
        } else {
            const leastArgs =
                cmd.args.length - cmd.args.filter(x => x.optional).length;
            if (stringArgs.length < leastArgs) {
                return msg.reply(
                    `:warning: expected at least ${leastArgs} argument${
                        leastArgs !== 1 ? "s" : ""
                    } but got ${stringArgs.length} argument${
                        stringArgs.length !== 1 ? "s" : ""
                    } instead`
                );
            } else if (cmd.exactArgs && stringArgs.length > cmd.args.length) {
                return msg.reply(
                    `:warning: expected at most ${cmd.args.length} argument${
                        cmd.args.length !== 1 ? "s" : ""
                    } but got ${stringArgs.length} argument${
                        stringArgs.length !== 1 ? "s" : ""
                    } instead`
                );
            }
            for (const i in stringArgs) {
                if (!cmd.args[i]) continue; // avoid null
                const sa = stringArgs[i];
                // Beware: arg is `unknown`
                const arg = getArgTypes(this.client)[cmd.args[i].type.name](
                    sa,
                    msg
                );
                if (arg === null || arg === undefined) {
                    return msg.reply(
                        `:warning: argument #${
                            parseInt(i, 10) + 1
                        } is not of expected type ${cmd.args[i].type.name}`
                    );
                } else typedArgs.push(arg);
            }
        }

        // Executing the command
        const context = new Context(msg, matchingPrefix, cmdTrigger, cmd);
        try {
            const result = cmd.func.call(
                cmd.module,
                cmd.usesContextAPI ? context : msg,
                ...typedArgs
            );
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
        this.client.emit("commandExecution", context);
    }
}
