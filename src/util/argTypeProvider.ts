import CookiecordClient from "../client";
import { Message, User, GuildMember } from "discord.js";

export type ArgTypes = {
    [key: string]: (s: string, msg: Message) => unknown;
};

const USER_PATTERN = /(?:<@!?)?(\d+)>?/;
const CHANNEL_PATTERN = /(?:<#)?(\d+)>?/;
const ROLE_PATTERN = /(?:<@&)?(\d+)>?/;

export function getArgTypes(client: CookiecordClient) {
    return Object.assign(
        {
            Number: s => (isNaN(parseFloat(s)) ? null : parseFloat(s)),
            String: s => s,
            Command: s => client.commandManager.getByTrigger(s),
            Listener: s => client.listenerManager.getById(s),
            User: (s, msg) => {
                const res = USER_PATTERN.exec(s);
                let user: User | undefined;

                if (res && res[1]) user = msg.client.users.cache.get(res[1]);
                if (!user)
                    user = msg.client.users.cache.find(
                        m => m.tag.toLowerCase() == s.toLowerCase()
                    );
                if (!user)
                    user = msg.client.users.cache.find(
                        u => u.username.toLowerCase() == s.toLowerCase()
                    );
                console.log(user);
                return user;
            },
            GuildMember: (s, msg) => {
                if (!msg.guild) return;
                const res = USER_PATTERN.exec(s);
                let member: GuildMember | undefined;
                if (res && res[1]) member = msg.guild.members.cache.get(res[1]);
                if (!member)
                    member = msg.guild.members.cache.find(m => m.user.tag == s);
                if (!member)
                    member = msg.guild.members.cache.find(m => m.nickname == s);
                if (!member)
                    member = msg.guild.members.cache.find(
                        m => m.user.username == s
                    );
                return member;
            },
            TextChannel: (s, msg) => {
                const res = CHANNEL_PATTERN.exec(s);
                if (!res || !msg.guild) return;
                return msg.guild.channels.cache.get(res[1]);
            },
            Role: (s, msg) => {
                const res = ROLE_PATTERN.exec(s);
                if (!res || !msg.guild) return;
                return msg.guild.roles.cache.get(res[1]);
            }
        } as ArgTypes,
        client.commandArgumentTypes
    );
}
