Welcome to the Cookiecord Guide! Here you can learn how to make a discord bot with Cookiecord from the ground up.

This guide does assume you have atleast some experience with Node.js projects.

-   [Basics](#basics)
    -   [Setting up the environment](#setting-up-the-environment)
    -   [Your First Bot](#your-first-bot)
-   [Commands](#commands)
    -   [Arguments](#arguments)
    -   [Inhibitors](#inhibitors)
    -   [Aliases](#aliases)
    -   [Single-Arg Mode](#single-arg-mode)
    -   [Context API](#context-api)
    -   [Optional Arguments](#optional-arguments)
-   [cookiecord-generator](#cookiecord-generator)

# Basics

## Setting up the environment

Install Node.js and Yarn if you don't have them already and make a new folder for your bot, open a command prompt in your folder, run `yarn init`, answer the questions or press _Enter_ for the default answer, install Cookiecord, TypeScript and ts-node using `yarn add cookiecord typescript ts-node` and put this [file](https://raw.githubusercontent.com/cookiecord/cookiecord-generator/master/gen/tsconfig.json) in your folder as `tsconfig.json` to tell TypeScript to allow decorators.

## Your First Bot

With the enviroment setup we can now proceed to write some code for your bot, let's start with a really simple example and go over it line by line:

```ts
// Just importing things
import { Message } from "discord.js";
import { command, default as CookiecordClient, Module } from "cookiecord";
// Creating a new class which is also a module.
class PingModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }
    // Declaring a new command called "ping"
    @command()
    ping(msg: Message) {
        // When the command is ran, reply with "Pong"
        msg.reply("Pong");
    }
}
// Starting the bot and registering the module we made above.
new CookiecordClient()
    .registerModule(PingModule)
    // Logging into Discord.
    .login(process.env.TOKEN);
```

Let's test it by saving it as `index.ts` in the folder and running it with ts-node:

```sh
$ TOKEN=YOUR_BOTS_TOKEN yarn ts-node index.ts
```

Now the bot's running but you need to [invite](https://discordjs.guide/preparations/adding-your-bot-to-servers.html) it to a server to test it, now that it's in your server, the default prefix is `cc!` so when you write `cc!ping` in chat the bot should respond.

# Commands

## Arguments

Cookiecord has a ArgTypes system which allows for easy command writing with custom arguments:
[`example/day.ts`](https://github.com/cookiecord/cookiecord/blob/master/example/day.ts)

```ts
import { Message } from "discord.js";
import { command, default as CookiecordClient, Module } from "cookiecord";

class DayModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }

    @command()
    day(msg: Message, d: Date) {
        msg.reply("The day of the week is: " + d.getDay());
    }
}

new CookiecordClient({ commandArgumentTypes: { Date: s => new Date(s) } })
    .registerModule(DayModule)
    .login(process.env.TOKEN);
```

## Inhibitors

You can restrict access to commands by using one of the built in inhibitors or by writing a custom inhibitor:
[`example/inhibitors.ts`](https://github.com/cookiecord/cookiecord/blob/master/example/inhibitors.ts)

```ts
import { Message } from "discord.js";
import {
    command,
    default as CookiecordClient,
    Module,
    CommonInhibitors
} from "cookiecord";

class InhibitorsModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }

    @command({ inhibitors: [CommonInhibitors.botAdminsOnly] })
    supersecret(msg: Message) {
        msg.reply(
            "The bot's token starts with: " + this.client.token?.slice(0, 2)
        );
    }

    @command({
        inhibitors: [
            async msg =>
                msg.author.username.toLowerCase().includes("cookie")
                    ? undefined
                    : "username must include cookie"
        ]
    })
    custominhibitor(msg: Message) {
        msg.reply(
            "Your username has cookie in it! Have a cookie: https://cdn.discordapp.com/avatars/142244934139904000/0db321441968e15b0ee25224746d6bff.png"
        );
    }
}

new CookiecordClient({
    commandArgumentTypes: { Date: s => new Date(s) },
    botAdmins: process.env.BOT_ADMINS?.split(",")
})
    .registerModule(InhibitorsModule)
    .login(process.env.TOKEN);
```

## Aliases

Commands can have aliases:

```ts
...
    @command({ aliases: ["pung", "pong"] })
    ping(msg: Message) {
        msg.reply("Pong. :ping_pong:");
    }
...
```

You could now run this command with your prefix and `pung`, `pong` or `ping`.

## Single-Arg Mode

In Single-Arg Mode the command can accept the full message but without the prefix:

```ts
...
    @command({ single: true })
    single(msg: Message, str: string) {
        msg.reply("You said " + str);
    }
...
```

So if you sent `cc!single hello world foo bar` then `str` would be `hello world foo bar`.

## Context API

**Warning: The Context API is still very new and should be used with care.**

Commands can also take in a `Context` object instead of a `Message` for their first argument; the Context API provides additional information about the trigger and prefix used to execute the command.

This command will send "pong" when you send "ping" and vice versa:

```ts
    @command({ aliases: ["pong"] })
    ping({ msg, trigger }: Context) {
        msg.reply(`${trigger == "pong" ? "ping" : "pong"} :ping_pong:`);
    }
```

## Optional Arguments

**Warning: Optional arguments are not fully validated as TypeScript cannot provide that level of metadata right now.**

Certain arguments in a command can be marked as optional to allow the command parser to still call the function even if they are missing.

Like normal TS/JS optional arguments can only be at the end of the function like so: `(required, optional, optional)` and cannot be mixed in with other required arguments like so: `(required, optional, requried)`

This command will add two numbers and if the second number is not provided, it will simply add the first number onto itself:

```ts
    @command()
    add(msg: Message, x: number, @optional y?: number) {
        msg.reply(x + (y || x));
    }
```

The `?` in `y?: number` is **REQUIRED** to make sure TypeScript can validate the types correctly

# cookiecord-generator

`cookiecord-generator` is a CLI that can generate new cookiecord bots automagically:

```sh
$ yarn global add cookiecord-generator
$ cookiecord-generator generate easy-bot
```

# Thanks to

-   [Discord.js guide](https://discordjs.guide/) for writing inspiration for this guide.
-   [Discord.js](https://discord.js.org) for making Cookiecord possible
-   [Akairo](https://discord-akairo.github.io/#/) for inspiration with Cookiecord's design.
-   [discord.py](https://github.com/Rapptz/discord.py) for inspiration with Cookiecord's design.
