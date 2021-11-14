import {
    GuildChannelResolvable,
    Message,
    MessageEmbed,
    Permissions,
    TextBasedChannel
} from "discord.js";
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
        const modules = Array.from(this.client.modules).filter(
            mod => getModuleCommands(mod).length !== 0
        );

        const commands = Array.from(this.client.commandManager.cmds);

        const initialEmbed = new MessageEmbed()
            .setTitle("Help")
            .setTimestamp()
            .setColor("BLUE");

        const embed = modules.reduce((embed, module) => {
            const filteredCommands = commands.filter(
                command => command.module === module
            );
            return embed.addField(
                module.constructor.name,
                filteredCommands
                    .map(command => {
                        const name = command.id.split("/")[1];
                        const description = command.description
                            ? `: *${command.description}*`
                            : "";
                        return `**${prefix}${name}**${description}`;
                    })
                    .join("\n"),
                true
            );
        }, initialEmbed);

        const fallbackContent = modules.reduce((content, module) => {
            const filteredCommands = commands.filter(
                command => command.module === module
            );
            return content.concat(
                "# " + module.constructor.name,
                filteredCommands
                    .map(command => {
                        const name = command.id.split("/")[1];
                        const description = command.description
                            ? `: ${command.description}`
                            : "";
                        return `${prefix}${name}${description}`;
                    })
                    .join("\n") + "\n"
            );
        }, [] as string[]);

        if (
            msg.guild &&
            msg.channel.isText() &&
            !msg.guild.me
                ?.permissionsIn(msg.channel as GuildChannelResolvable)
                .has(Permissions.FLAGS.EMBED_LINKS)
        ) {
            await msg.channel.send(
                `${CODEBLOCK}md\n${fallbackContent.join("\n")}\n${CODEBLOCK}`
            );
        } else {
            await msg.channel.send({ embeds: [embed] });
        }
    }
}
