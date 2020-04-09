import { Message } from "discord.js";

export default class Context {
    constructor(
        public msg: Message,
        public prefix: string,
        public trigger: string
    ) {}
}
