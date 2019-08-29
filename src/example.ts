import CookiecordClient from "./client";
import { command } from "./command/command";
import { Message, GuildMember, User, MessageReaction } from "discord.js";
import Module from "./module";
import { listener } from "./listener/index";

const client = new CookiecordClient({}, {});
client.login(process.env.TOKEN);
class PunishmentModule extends Module {
	constructor() {
		super(client);
	}
	@command({ description: "asd" })
	ban(msg: Message, a: string, b: number, u: User, m: GuildMember) {
		msg.reply(a + b + u.tag + m.nickname);
	}
	@command({ description: "abc", aliases: ["gc"] })
	guildcount(msg: Message, a: string, b: number, u: User, m: GuildMember) {
		// console.log(this);
		msg.reply(this._client.guilds.size);
	}
	@listener({event: "message"})	
	onTest(msg: Message) {
		if (msg.author.bot || msg.author.id !== "142244934139904000") return;
		msg.channel.send(`Listener test: ${msg.author.tag} | ${this._client.guilds.size}`);
	}
}

export default new PunishmentModule();
