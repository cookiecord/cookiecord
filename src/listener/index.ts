import Module from "../module";
import Event from "../util/event";
export interface IListenerDecoratorOptions {
    event: Event;
}
export interface IListenerDecoratorMeta {
    event: Event;
    id: string;
    func: Function;
}
export interface Listener {
    event: Event;
    id: string;
    module: Module;
    func: Function;
}
export function listener(opts: IListenerDecoratorOptions) {
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
