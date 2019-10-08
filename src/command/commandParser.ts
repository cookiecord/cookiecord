import Module from "../module";
import CookiecordClient from "../client";
import { listener } from "../listener";
import { Message } from "discord.js";
type ArgType = {
    [key: string]: (s: string) => unknown;
};
const types: ArgType = {
    Number: s => isNaN(parseFloat(s)) ? null : parseFloat(s),
    String: s => s,
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
                `expected ${cmd.types.length} arguments but got ${stringArgs.length} arguments instead.`
            );
		const typedArgs = [] as unknown[];
        for (const i in stringArgs) {
			const sa = stringArgs[i];
			const arg = types[cmd.types[i].name](sa);
			if (arg === null) {
				return msg.reply(`expected argument #${i} is not of expected type ${cmd.types[i].name}`)
			} else typedArgs.push(arg)
		}

        cmd.func.call(cmd.module, msg, ...typedArgs);
    }
}
