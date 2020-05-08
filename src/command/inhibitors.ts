import { Message, PermissionResolvable } from "discord.js";
import humanizeDuration from "humanize-duration";
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

const guildsOnly: Inhibitor = async msg =>
    msg.member ? undefined : "not in a guild";

const dmsOnly: Inhibitor = async msg =>
    msg.channel.type == "dm" ? undefined : "not in dms";

const hasGuildPermission = (perm: PermissionResolvable) =>
    mergeInhibitors(guildsOnly, async msg =>
        msg.member!.hasPermission(perm)
            ? undefined
            : "missing discord permission " + perm
    );

const userCooldown = (ms: number): Inhibitor => {
    const map: Map<string, number> = new Map();
    return async msg => {
        if (map.has(msg.author.id)) {
            if ((map.get(msg.author.id) || 0) < Date.now()) {
                map.set(msg.author.id, Date.now() + ms);
                return undefined;
            } else {
                return `you must wait ${humanizeDuration(
                    Date.now() - (map.get(msg.author.id) || 0)
                )} to run this command!`;
            }
        } else {
            map.set(msg.author.id, Date.now() + ms);
            return undefined;
        }
    };
};

type Inhibitor = (
    msg: Message,
    client: CookiecordClient
) => Promise<string | undefined>;
export { Inhibitor };
export default {
    botAdminsOnly,
    guildsOnly,
    dmsOnly,
    hasGuildPermission,
    userCooldown
};
