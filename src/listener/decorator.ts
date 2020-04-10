import Module from "../module";
import { ClientEvents } from "discord.js";

type Event = keyof ClientEvents;

export interface IListenerDecoratorOptions {
    event: Event;
}
export interface IListenerDecoratorMeta {
    event: Event;
    id: string;
    func: Function;
}

export default function listener(opts: IListenerDecoratorOptions) {
    return function(
        target: Module,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const targetConstructorName = target.constructor.name; // Making this a variable to avoid some weird TS bug.
        if (!(target instanceof Module))
            throw new TypeError(
                `${targetConstructorName} doesn't extend Module`
            );
        if (descriptor.value.constructor.name !== "Function")
            throw new TypeError("Decorator needs to be applied to a Method.");

        const listenersMeta: IListenerDecoratorMeta[] =
            Reflect.getMetadata("cookiecord:listenerMetas", target) || [];

        listenersMeta.push({
            event: opts.event,
            id: propertyKey,
            func: Reflect.get(target, propertyKey)
        });

        Reflect.defineMetadata(
            "cookiecord:listenerMetas",
            listenersMeta,
            target
        );
    };
}
export { Event };
