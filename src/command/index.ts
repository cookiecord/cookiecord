import { Message } from "discord.js";
import CookiecordClient from "../client";
import Module from "../module";
import { Context } from "..";
type Inhibitor = (
    msg: Message,
    client: CookiecordClient
) => Promise<string | undefined>;
export { Inhibitor };
export { ICommandDecorator };
export interface ICommandDecoratorOptions {
    description: string;
    aliases: string[];
    single: boolean;
    inhibitors: Inhibitor[];
    onError: (msg: Message, error: Error) => void;
}
interface ICommandDecoratorMeta {
    id: string;
    types: Function[];
    usesContextAPI: boolean;
    optionals: number[];
}
type ICommandDecorator = ICommandDecoratorMeta & ICommandDecoratorOptions;
export interface Command {
    func: Function;
    types: Function[];
    triggers: string[];
    id: string;
    description: string;
    module: Module;
    single: boolean;
    inhibitors: Inhibitor[];
    usesContextAPI: boolean;
    optionals: number[];
    onError: (msg: Message, error: Error) => void;
}
export function command(
    opts: Partial<ICommandDecoratorOptions> | undefined = {}
) {
    return function(
        target: Module,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const targetConstructorName = target.constructor.name;
        if (!(target instanceof Module))
            throw new TypeError(
                `${targetConstructorName} doesn't extend Module`
            );
        if (descriptor.value.constructor.name !== "Function")
            throw new TypeError(
                "Something weird happend.. The decorator wasn't applied to a function."
            );
        const types: Function[] = Reflect.getMetadata(
            "design:paramtypes",
            target,
            propertyKey
        );
        // Optional arg stuff
        const optionals: number[] =
            Reflect.getMetadata(
                "cookiecord:optionalCommandArgs",
                target,
                propertyKey
            ) || [];
        if (optionals.includes(0))
            throw new Error("The first argument may not be optional");
        let last: number = optionals[0] + 1;
        for (let x of optionals) {
            if (last - x !== 1)
                throw new Error("Only the last arguments can be optional");
            last = x;
        }

        const newMeta: ICommandDecorator = {
            aliases: opts.aliases || [],
            description: opts.description || "No description set.",
            id: propertyKey,
            types: types.slice(1),
            single: opts.single || false,
            inhibitors: opts.inhibitors || [],
            usesContextAPI: types[0] == Context,
            optionals,
            onError:
                opts.onError ||
                (msg => {
                    msg.reply(":warning: error while executing command!");
                })
        };
        const targetMetas: ICommandDecorator[] =
            Reflect.getMetadata("cookiecord:commandMetas", target) || [];
        targetMetas.push(newMeta);
        Reflect.defineMetadata("cookiecord:commandMetas", targetMetas, target);
    };
}
