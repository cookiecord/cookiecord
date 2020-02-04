import { Message } from "discord.js";
import "reflect-metadata";
import CookiecordClient from "../client";
import Module from "../module";
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
}
interface ICommandDecoratorMeta {
    id: string;
    types: Function[];
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
}
export function command(
    opts: Partial<ICommandDecoratorOptions> | undefined = {}
) {
    return function(
        target: Module,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // @ts-ignore
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
        ).slice(1);
        const newMeta: ICommandDecorator = {
            aliases: opts.aliases || [],
            description: opts.description || "No description set.",
            id: propertyKey,
            types,
            single: opts.single || false,
            inhibitors: opts.inhibitors || []
        };
        const targetMetas: ICommandDecorator[] =
            Reflect.getMetadata("cookiecord:commandMetas", target) || [];
        targetMetas.push(newMeta);
        Reflect.defineMetadata("cookiecord:commandMetas", targetMetas, target);
    };
}
