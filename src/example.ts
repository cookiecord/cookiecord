import { command, Module, listener, default as CookiecordClient } from ".";
import { Message, GuildMember, User } from "discord.js";
import de from "dotenv";
de.config();
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
    guildcount(msg: Message, offset: number) {
        msg.reply(this.client.guilds.size + offset);
	}
	
    @listener({ event: "message" })
    onTest(msg: Message) {
		console.log("onTest", msg.content);
    }
}

export default new PunishmentModule();
