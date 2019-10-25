import { GuildMember, User } from "discord.js";
import CookiecordClient from "../client";

enum Permission {
    EVERYONE,
    GUILD_MOD,
    GUILD_ADMIN,
    BOT_ADMIN
}

export default Permission;
export function getUserPermission(client: CookiecordClient, user: User): Permission {
	if (client.botAdmins.includes(user.id)) return Permission.BOT_ADMIN
	else return Permission.EVERYONE;
}

export function getMemberPermission(client: CookiecordClient, gm: GuildMember): Permission {
	if (getUserPermission(client, gm.user) !== Permission.EVERYONE) return getUserPermission(client, gm.user);
	else if (gm.hasPermission("ADMINISTRATOR")) return Permission.GUILD_ADMIN
	else if (gm.hasPermission("BAN_MEMBERS")) return Permission.GUILD_MOD;
	else return Permission.EVERYONE;
}
