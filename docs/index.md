Welcome to the Cookiecord Guide! Here you can learn how to make a discord bot with Cookiecord from the ground up.
This guide does assume you have atleast some experience with Node.js projects.

# Basics

## Setting up the Enviroment
Install Node.js and Yarn if you don't have them already and make a new folder for your bot, open a command prompt in your folder, run `yarn init`, answer the questions or press *Enter* for the default answer, install Cookiecord, TypeScript and ts-node using `yarn add cookiecord typescript ts-node` and put this [file](https://raw.githubusercontent.com/cookiecord/cookiecord-generator/master/gen/tsconfig.json) in your folder.

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
Let's test it by saving it as index.ts in the folder and running it with ts-node:
```sh
$ yarn ts-node index.ts

```

(Work in progress, need to finish writing...)
# Commands

## Arguments
## Inhibitors
## Aliases
## Single-Arg Mode
## Error Handling

# Thanks to
- [Discord.js guide](https://discordjs.guide/) for writing inspiration for this guide.
- [Discord.js](https://discord.js.org) for making Cookiecord possible
- [Akairo](https://discord-akairo.github.io/#/) for inspiration with Cookiecord's design.
