import { Inhibitor } from "..";
import { Message, PermissionResolvable } from "discord.js";
import CookiecordClient from "..";

export function mergeInhibitors(a: Inhibitor, b: Inhibitor): Inhibitor {
    return async (msg, client) => {
        const aReason = await a(msg, client);
        if (aReason) return aReason;
        else return await b(msg, client);
    };
}

const botAdminsOnly: Inhibitor = async (
    msg: Message,
    client: CookiecordClient
) => (client.botAdmins.includes(msg.author.id) ? undefined : "not a bot admin");

const guildsOnly: Inhibitor = async (msg, client) =>
    msg.member ? undefined : "not in a guild";

const dmsOnly: Inhibitor = async (msg, client) =>
    msg.channel.type == "dm" ? undefined : "not in dms";

const hasGuildPermission = (perm: PermissionResolvable) =>
    mergeInhibitors(guildsOnly, async (msg, client) =>
        msg.member!.hasPermission(perm)
            ? undefined
            : "missing discord permission " + perm
    );
export default { botAdminsOnly, guildsOnly, dmsOnly, hasGuildPermission };
