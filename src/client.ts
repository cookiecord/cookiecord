import { Client, ClientOptions } from "discord.js";
import CommandManager from "./command/commandManager";
import ListenerManager from "./listener/listenerManager";
import CommandParserModule, { ArgTypes } from "./command/commandParser";
interface CookiecordOptions {
	botAdmins?: string[];
	commandArgumentTypes?: ArgTypes;
	commandPrefix?: string
}
export default class CookiecordClient extends Client {
	public commandManager: CommandManager;
	public listenerManager: ListenerManager;
	public botAdmins: string[];
	public commandPrefix: string;
	constructor(opts: CookiecordOptions = {}, discordOpts: ClientOptions = {}) { // look at the example lol wait!!! 
		super(discordOpts);
		this.botAdmins = opts.botAdmins || []; 
		this.commandPrefix = opts.commandPrefix || "cc!";
		this.commandManager = new CommandManager();
		this.listenerManager = new ListenerManager(this);
		new CommandParserModule(this, opts.commandArgumentTypes || {});
	}
}