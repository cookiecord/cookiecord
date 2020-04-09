import { Message } from "discord.js";

export default class Context {
    prefix: string;
    trigger: string;
    msg: Message;
    constructor(msg: Message, prefix: string, trigger: string) {
        this.msg = msg;
        this.prefix = prefix;
        this.trigger = trigger;
    }
}
