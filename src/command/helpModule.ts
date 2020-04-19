import { Message } from "discord.js";
import CookiecordClient from "../client";
import Module from "../module";
import { command } from "./decorator";
import { getModuleCommands } from "../util/getModuleAssociates";

export default class HelpModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }
    @command()
    async help(msg: Message) {
        const CODEBLOCK = "```";
        const prefix = await this.client.getPrefix(msg);
        msg.channel.send(`${CODEBLOCK}
${Array.from(this.client.modules)
    .filter(mod => getModuleCommands(mod).length !== 0)
    .map(
        module => `${module.constructor.name}:
${Array.from(this.client.commandManager.cmds)
    .filter(c => c.module == module)
    .map(cmd => `	${prefix}${cmd.id.split("/")[1]}`)
    .join("\n")}`
    )
    .join("\n")}
${CODEBLOCK}`);
    }
}
