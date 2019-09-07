import CookiecordClient from "./client";
import "reflect-metadata";
import { Command, ICommandDecoratorMeta, command } from "./command";
import { Listener, IListenerDecoratorMeta } from "./listener";

export default class Module {
	public client: CookiecordClient;
	constructor(client: CookiecordClient) {
		this.client = client;
		const cmds: Command[] = Reflect.getMetadata("cookiecord:commands", this) || [];
		console.log(`Loaded module ${this.constructor.name} with ${this.processListeners()} listeners and ${this.processCommands()} commands`);
	}
	processListeners() {
		const listenersMeta: IListenerDecoratorMeta[] =
			Reflect.getMetadata("cookiecord:listenerMetas", this) || [];
		const listeners = listenersMeta.map(opts => {
			const listener: Listener = {
				event: opts.event,
				id: opts.id,
				module: this,
				func: opts.func
			};
			return listener;
		});
		listeners.forEach(l => this.client.listenerManager.add(l));
		return listeners.length;
	}
	processCommands() {
		const targetMetas: ICommandDecoratorMeta[] =
			Reflect.getMetadata("cookiecord:commandMetas", this) || [];
		const commands = targetMetas.map(meta => {
			const newCommand: Command = {
				description: meta.description,
				func: Reflect.get(this, meta.id),
				id: meta.id,
				types: meta.types,
				triggers: [meta.id].concat(meta.aliases || []),
				module: this
			};
			return newCommand;
		});
		commands.forEach(cmd => this.client.commandManager.add(cmd));
		
		return commands.length;
	}
}
