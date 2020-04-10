import { ICommandArgument } from "./decorator";
import { Module, Inhibitor } from "..";
import { Message } from "discord.js";

export default interface Command {
    func: Function;
    args: ICommandArgument[];
    triggers: string[];
    id: string;
    description?: string;
    module: Module;
    single: boolean;
    inhibitors: Inhibitor[];
    usesContextAPI: boolean;
    onError: (msg: Message, error: Error) => void;
}
