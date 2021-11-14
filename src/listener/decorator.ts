import Module from "../module";
import { Event } from "../util/clientEvents";

export interface IListenerDecoratorOptions {
    event: Event;
    once?: boolean;
}
interface IListenerDecoratorMeta {
    id: string;
    func: Function;
}

export type IListenerDecorator = IListenerDecoratorOptions &
    IListenerDecoratorMeta;

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
        if (!(descriptor.value.constructor instanceof Function))
            throw new TypeError(
                `Decorator needs to be applied to a Method. (${targetConstructorName}#${descriptor.value.name} was ${descriptor.value.constructor.name})`
            );

        const listenersMeta: IListenerDecorator[] =
            Reflect.getMetadata("cookiecord:listenerMetas", target) || [];

        listenersMeta.push({
            event: opts.event,
            once: opts.once || false,
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
