import { Module } from "..";

export default function optional(
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
) {
    if (!(target instanceof Module))
        throw new TypeError(`${target.constructor.name} doesn't extend Module`);
    const descriptor = Reflect.getOwnPropertyDescriptor(target, propertyKey);
    if (descriptor?.value.constructor.name !== "Function")
        throw new TypeError("Decorator needs to be applied to a Method.");

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
