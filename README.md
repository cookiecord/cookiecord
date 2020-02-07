# Cookiecord

Cookiecord simplifies discord bot development by providing a modern and easy to use interface.

Just import Cookiecord and Discord.js and make your commands (and listeners):

`example/ping.ts`

```ts
import { Message } from "discord.js";
import { command, default as CookiecordClient, Module } from "cookiecord";

class PingModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }

    @command()
    ping(msg: Message) {
        msg.reply("Pong. :ping_pong:");
    }
}

new CookiecordClient().registerModule(PingModule).login(process.env.TOKEN);
```

## Features

-   Simple: Cookiecord aims to keep the API very simple and easy to use.
-   Inhibitors: Cookiecord includes a powerful inhibitor system with builtin inhibitors to make restricting commands super easy.
-   Powerful Argument System: Cookiecord automatically validates the user's input based on the variables your function takes in.
-   Super Fast Development: Cookiecord can automatically reload all of your commands and listeners (using `CookiecordClient#reloadModulesFromFolder`).

## Installation

If you would like to help test Cookiecord while it's still young you can install Cookiecord by running:

```sh
# With Yarn
$ yarn add cookiecord
# With NPM
$ npm install cookiecord
```

## Contribute

Pull requests are always welcome but I would like Cookiecord to remain simple so you should probably ask me about it first.

## Support

If you are having issues, please let us know.
We have a support chat on [Discord](https://discord.gg/ubPbX98).

## License

The project is licensed under the GPL-3 license.
