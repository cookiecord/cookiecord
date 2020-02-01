import { Inhibitor } from "..";
import { Message } from "discord.js";
import CookiecordClient from "..";

const botAdminsOnly: Inhibitor = async (
    msg: Message,
    client: CookiecordClient
) => (client.botAdmins.includes(msg.author.id) ? undefined : "not a bot admin");

export default { botAdminsOnly }