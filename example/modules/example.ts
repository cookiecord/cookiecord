import {
    command,
    Module,
    listener,
    default as CookiecordClient,
    CommonInhibitors,
    Context,
    optional,
    multiPrompt,
    mergeInhibitorsNonXor,
    mergeInhibitors
} from "../../src";
import {
    Message,
    GuildMember,
    User,
    Guild,
    TextChannel,
    Role
} from "discord.js";
import { inspect } from "util";
import { readFileSync } from "fs";

export default class ExampleModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }
    @command()
    goodbot(msg: Message, bot: User) {
        if (!bot.bot) return msg.channel.send("user needs to be a bot");
        msg.channel.send(`${bot} is a very good boat.`);
    }
    @command()
    contextdump(ctx: Context) {
        ctx.msg.channel.send(inspect(ctx, false, 0, false));
    }
    @command()
    add(msg: Message, x: number, @optional y?: number) {
        msg.channel.send(`${x + (y || x)}`);
    }

    @command()
    avatar(msg: Message, u: User) {
        msg.channel.send(u.displayAvatarURL());
    }

    @command({ description: "asd" })
    test(msg: Message, a: string, b: number, u: User, m: GuildMember) {
        msg.channel.send(a + b + u.tag + m.nickname);
    }

    @command({ description: "abc", aliases: ["gc"] })
    guildcount(msg: Message, offset: number) {
        msg.channel.send(`${this.client.guilds.cache.size + offset}`);
    }

    @listener({ event: "ready", once: true })
    onceReady() {
        console.log("onceReady");
    }

    @listener({ event: "messageCreate" })
    onMessage(msg: Message) {
        console.log("onMessage", msg.content);
    }

    @listener({ event: "commandExecution" })
    onExec(ctx: Context) {
        console.log("onCommandExecution, the command id is:", ctx.cmd.id);
    }

    @command({ aliases: ["pong"] })
    ping({ msg, trigger }: Context) {
        msg.channel.send(`${trigger == "pong" ? "ping" : "pong"} :ping_pong:`);
    }
    @command({ single: true })
    single(msg: Message, str: string) {
        msg.channel.send("You said " + str);
    }
    @command({ exactArgs: true })
    exact(msg: Message, word: string) {
        msg.channel.send("Exact word: " + word);
    }
    @command()
    badboy(msg: Message, m: GuildMember) {
        msg.channel.send(`${m} is a bad boy!`);
    }
    @command({})
    todo(msg: Message) {
        msg.channel.send("```" + readFileSync("../TODO").toString() + "```");
    }
    @command({
        inhibitors: [
            CommonInhibitors.hasGuildPermission("BAN_MEMBERS"),
            CommonInhibitors.userCooldown(1000 * 10)
        ]
    })
    fakeban(msg: Message, m: GuildMember) {
        msg.channel.send(`${m}:hammer:`);
    }
    @command({
        onError: msg => {
            msg.channel.send("custom error reply!");
        }
    })
    triggerError(msg: Message) {
        throw new Error("triggered dat error!");
    }
    @command()
    chandesc(msg: Message, c: TextChannel) {
        msg.channel.send(c.topic ?? "");
    }
    @command()
    rolecolor(msg: Message, r: Role) {
        msg.channel.send("role color: " + r.hexColor);
    }
    @command()
    async multiprompt(msg: Message) {
        const res = await multiPrompt(msg, {
            fat: "Are you fat?",
            tall: "Are you tall?",
            thin: "Are you thin?"
        });
        msg.channel.send(
            `using the variables with the types:
fat=${res.fat}
tall=${res.tall}
thin=${res.thin}`
        );
    }


    // This should enforce the cooldown
    @command({ inhibitors: [CommonInhibitors.userCooldown(100000)] })
    cooldown(msg: Message) {
        msg.reply("okay");
    }

    // This should also enforce it unless you're a bot admin
    @command({ inhibitors: [mergeInhibitorsNonXor(CommonInhibitors.userCooldown(100000), CommonInhibitors.botAdminsOnly)] })
    inclusiveor(msg: Message) {
        msg.reply("okay");
    }


    // This should also enforce both the cooldown and you being a bot admin
    @command({ inhibitors: [mergeInhibitors(CommonInhibitors.userCooldown(100000), CommonInhibitors.botAdminsOnly)] })
    cooland(msg: Message) {
        msg.reply("okay");
    }

    // // CookiecordClient isn't a ArgType
    // badcmd(msg: Message, nonexistant: CookiecordClient) {
    //     msg.channel.send("hi!");
    // }

    // This command is very stupid and should not exist anywhere near production!!!!!!!!!!
    @command({
        description: "eval some js",
        single: true,
        inhibitors: [CommonInhibitors.botAdminsOnly]
    })
    async eval(msg: Message, js: string) {
        console.log("EVAL", js);
        try {
            let result = eval(js);
            if (result instanceof Promise) result = await result;
            if (typeof result != `string`) result = inspect(result);
            if (result.length > 1990)
                return await msg.channel.send(
                    `Message is over the discord message limit.`
                );
            await msg.channel.send(
                "```js\n" +
                result
                    .split(this.client.token)
                    .join("[TOKEN]")
                    .split("```")
                    .join("\\`\\`\\`") +
                "\n```"
            );
        } catch (error) {
            msg.channel.send(
                "error! " +
                (error || "")
                    .toString()
                    .split(this.client.token)
                    .join("[TOKEN]")
            );
        }
    }
}
