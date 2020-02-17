import CookiecordClient from "../client";
import { Message } from "discord.js";

export type ArgTypes = {
    [key: string]: (s: string, msg: Message) => unknown;
};

const USER_PATTERN = /<@!?(\d+)>/;
const CHANNEL_PATTERN = /<#(\d+)>/;
const ROLE_PATTERN = /<@&(\d+)>/;

export function getArgTypes(client: CookiecordClient) {
    return Object.assign(
        {
            Number: s => (isNaN(parseFloat(s)) ? null : parseFloat(s)),
            String: s => s,
            Command: s => client.getCommandByTrigger(s),
            Listener: s => client.getListenerById(s),
            User: (s, msg) => {
                const res = USER_PATTERN.exec(s);
                if (!res) return;
                return msg.client.users.get(res[1]);
            },
            GuildMember: (s, msg) => {
                const res = USER_PATTERN.exec(s);
                if (!res || !msg.guild) return;
                return msg.guild.members.get(res[1]);
            },
            TextChannel: (s, msg) => {
                const res = CHANNEL_PATTERN.exec(s);
                if (!res || !msg.guild) return;
                return msg.guild.channels.get(res[1]);
            },
            Role: (s, msg) => {
                const res = ROLE_PATTERN.exec(s);
                if (!res || !msg.guild) return;
                return msg.guild.roles.get(res[1]);
            }
        } as ArgTypes,
        client.commandArgumentTypes
    );
}
