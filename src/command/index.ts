import Module from "../module";
import "reflect-metadata";
import Permission from "./permissions";
/*
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}*/
export interface ICommandDecoratorOptions {
    description: string;
    aliases?: string[];
    permission?: Permission;
}
export interface ICommandDecoratorMeta {
    description: string;
    aliases?: string[];
    id: string;
    types: Function[];
    permission: Permission;
}
export interface Command {
    func: Function;
    types: Function[];
    triggers: string[];
    id: string;
    description: string;
    module: Module;
    permission: Permission;
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
        // const newCommand: Command = {
        //     description: opts.description,
        //     func: Reflect.get(target, propertyKey),
        //     id: propertyKey,
        //     types: types,
        //     triggers: [propertyKey].concat(opts.aliases || []),
        //     module: target
        // };
        const newMeta: ICommandDecoratorMeta = {
            aliases: opts.aliases,
            description: opts.description,
            id: propertyKey,
			types,
			permission: opts.permission || Permission.EVERYONE
        };
        const targetMetas: ICommandDecoratorMeta[] =
            Reflect.getMetadata("cookiecord:commandMetas", target) || [];
        targetMetas.push(newMeta);
        Reflect.defineMetadata("cookiecord:commandMetas", targetMetas, target);
    };
}
