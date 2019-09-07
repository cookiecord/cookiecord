import Module from "./module";
import CookiecordClient from "./client";
import { listener } from "./listener";
import { Message } from "discord.js";
import { Command } from "./command";
import util from "util";

export default class CommandParserModule extends Module {
	public client: CookiecordClient
	constructor(client: CookiecordClient) {
		super(client);
		// console.log(client);
		this.client = client;
	}
	@listener({event: "message"})
	onMessage(msg: Message) {
		const prefix = "cc!";
		if (msg.author.bot) return;
		if (!msg.content.startsWith(prefix)) return;
		const noPrefix = msg.content.replace(prefix, "");
		const stringArgs: string[] = noPrefix.split(" ").slice(1) || [];
		const cmdTrigger = noPrefix.split(" ")[0];
		const cmd = this.client.commandManager.cmds.find(c => c.triggers.includes(cmdTrigger));
		if (!cmd) return;
		// msg.reply(util.inspe8ct(cmd, false, 1, false));
		cmd.func.call(cmd.module, msg, ...stringArgs);
	}
}