import { Message } from "discord.js";
import { Command } from "..";

export default class Context {
    constructor(
        public msg: Message,
        public prefix: string,
        public trigger: string,
        public cmd: Command
    ) {}
}
