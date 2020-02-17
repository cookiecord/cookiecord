import "reflect-metadata";
import CookiecordClient from "./client";
import { Command, ICommandDecorator } from "./command";
import { IListenerDecoratorMeta, Listener } from "./listener";
import { getArgTypes } from "./util/argTypeProvider";

export default class Module {
    public client: CookiecordClient;
    constructor(client: CookiecordClient) {
        this.client = client;
    }
    processListeners() {
        const listenersMeta: IListenerDecoratorMeta[] =
            Reflect.getMetadata("cookiecord:listenerMetas", this) || [];
        const listeners = listenersMeta.map(opts => {
            const listener: Listener = {
                event: opts.event,
                id: this.constructor.name + "/" + opts.id,
                module: this,
                func: opts.func
            };
            return listener;
        });
        return listeners;
    }
    processCommands() {
        const targetMetas: ICommandDecorator[] =
            Reflect.getMetadata("cookiecord:commandMetas", this) || [];
        const commands = targetMetas.map(meta => {
            const newCommand: Command = {
                description: meta.description,
                func: Reflect.get(this, meta.id),
                id: this.constructor.name + "/" + meta.id,
                types: meta.types,
                triggers: [meta.id]
                    .concat(meta.aliases)
                    .map(id => id.toLowerCase()),
                module: this,
                single: meta.single,
                inhibitors: meta.inhibitors,
                onError: meta.onError
            };
            if (
                newCommand.single &&
                !(newCommand.types[0] == String && newCommand.types.length == 1)
            )
                throw new Error(
                    `error while parsing command ${newCommand.id}: single arg commands can only take in one string`
                );
            newCommand.types.forEach(type => {
                if (!getArgTypes(this.client)[type.name])
                    throw new Error(
                        `command tried to use an unsupported argument type ${type.name}`
                    );
            });

            return newCommand;
        });
        return commands;
    }
}
