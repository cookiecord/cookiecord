import Module from "../module";
import "reflect-metadata";
export interface ICommandDecoratorOptions {
    description?: string;
    aliases?: string[];
    single?: boolean;
}
interface ICommandDecoratorMeta {
    id: string;
    types: Function[];
}
type ICommandDecorator = ICommandDecoratorMeta & ICommandDecoratorOptions;
export { ICommandDecorator };
export interface Command {
    func: Function;
    types: Function[];
    triggers: string[];
    id: string;
    description: string;
    module: Module;
    single: boolean;
}
export function command(opts: ICommandDecoratorOptions) {
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
            description: opts.description,
            id: propertyKey,
            types,
            single: opts.single || false
        };
        const targetMetas: ICommandDecorator[] =
            Reflect.getMetadata("cookiecord:commandMetas", target) || [];
        targetMetas.push(newMeta);
        Reflect.defineMetadata("cookiecord:commandMetas", targetMetas, target);
    };
}
