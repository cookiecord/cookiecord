import { Message } from "discord.js";

export async function multiPrompt<O extends { [key: string]: string }>(
    msg: Message,
    obj: O
) {
    const responses = obj as Record<keyof O, string>;
    for (const key in obj) {
        await msg.channel.send(obj[key]);
        const nmsg = (
            await msg.channel.awaitMessages(
                nmsg => nmsg.author.id == msg.author.id,
                {
                    max: 1,
                    time: 1000 * 60 * 2,
                    errors: ["time"]
                }
            )
        ).first();
        if (!nmsg) throw new Error("User did not respond in time");
        responses[key] = nmsg.content;
    }
    return responses;
}
