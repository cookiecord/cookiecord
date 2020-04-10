import { Module } from "..";

export function optional(
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
) {
    const targetConstructorName = target.constructor.name;
    if (!(target instanceof Module))
        throw new TypeError(`${targetConstructorName} doesn't extend Module`);
    const descriptor = Reflect.getOwnPropertyDescriptor(target, propertyKey);
    if (descriptor?.value.constructor.name !== "Function")
        throw new TypeError(
            "Something weird happened.. The decorator wasn't applied to a argument in a function."
        );
    const arr: number[] =
        Reflect.getMetadata(
            "cookiecord:optionalCommandArgs",
            target,
            propertyKey
        ) || [];
    arr.push(parameterIndex);
    Reflect.defineMetadata(
        "cookiecord:optionalCommandArgs",
        arr,
        target,
        propertyKey
    );
}
