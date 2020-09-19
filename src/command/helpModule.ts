import { Message, MessageEmbed } from "discord.js";
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
        const CODEBLOCK = "```"
        const prefix = await this.client.getPrefix(msg);
        const modules = Array.from(this.client.modules).filter(
            (mod) => getModuleCommands(mod).length !== 0
        );

        const _commands = Array.from(this.client.commandManager.cmds);

        const initialEmbed = new MessageEmbed()
            .setTitle("Help")
            .setTimestamp()
            .setColor("BLUE");

        const embed = modules.reduce((embed, module) => {
            const commands = _commands.filter(
                (command) => command.module === module
            );
            return embed.addField(
                module.constructor.name,
                commands.map((command) => {
                    const name = command.id.split("/")[1];
                    const description = command.description
                        ? `: *${command.description}*`
                        : "";
                    return `**${prefix}${name}**${description}`;
                }),
                true
            );
        }, initialEmbed);
        
        const nonEmbed = `${CODEBLOCK}
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
${CODEBLOCK}`
        if (!msg.guild){
            await msg.channel.send(embed);
        } else if (!msg.guild.me!.permissionsIn(msg.channel).has("EMBED_LINKS")) {
            await msg.channel.send(nonEmbed);
        } else {
            await msg.channel.send(embed);
        }
    }
}
