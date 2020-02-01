import { Inhibitor } from "..";
import { Message } from "discord.js";
import CookiecordClient from "..";

const botAdminsOnly: Inhibitor = async (
    msg: Message,
    client: CookiecordClient
) => (client.botAdmins.includes(msg.author.id) ? undefined : "not a bot admin");

const guildsOnly: Inhibitor = async (msg: Message, client: CookiecordClient) =>
    msg.member ? undefined : "not in a guild";

const dmsOnly: Inhibitor = async (msg: Message, client: CookiecordClient) =>
    msg.channel.type == "dm" ? undefined : "not in dms";

export default { botAdminsOnly, guildsOnly, dmsOnly };
