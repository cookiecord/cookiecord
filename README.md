# Cookiecord
Cookiecord is an experimental discord bot framework built in TypeScript using advanced features.
It has a discord.py-esque module system which allows for easy prototyping and clear concise code.

## Installation
Run `yarn add cookiecord` and then make sure you have the `emitDecoratorMetadata` and `experimentalDecorators` options on in your tsconfig.

## Usage
Go to the [Discord Developers Portal](https://discordapp.com/developers/applications/) and make a new bot application then get it's token.

Afterwards, import cookiecord, initalize the client and login with the token.
```ts
import CookiecordClient from "cookiecord";
const client = new CookiecordClient();
client.login("YourTokenHere");
```

### Modules
Cookiecord is based on "modules" which contain commands and Discord.js event listeners.

Here's a simple module:
```ts
import { command, Module, listener, default as CookiecordClient } from "cookiecord";
import { Message, GuildMember, User } from "discord.js";

export default class ExampleModule extends Module {
	constructor(client: CookiecordClient) {
		super(client);
	}

	@command({ description: "asd" })
	test(msg: Message, a: string, b: number, u: User, m: GuildMember) {
		msg.reply(a + b + u.tag + m.nickname);
	}

	@command({ description: "abc", aliases: ["gc"] })
	guildcount(msg: Message, offset: number) {
		msg.reply(this.client.guilds.size + offset);
	}

	@listener({ event: "message" })
	onTest(msg: Message) {
		console.log("onTest", msg.content);
	}
}
```