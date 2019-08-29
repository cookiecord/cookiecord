import { Client, ClientOptions } from "discord.js";
import CommandManager from "./command/commandManager";
import ListenerManager from "./listener/listenerManager";
import CommandParserModule from "./commandParser";
interface CookiecordOptions {

}
export default class CookiecordClient extends Client {
	public commandManager: CommandManager;
	public listenerManager: ListenerManager;
	constructor(opts: CookiecordOptions, discordOpts: ClientOptions) { // look at the example lol wait!!! 
		super(discordOpts);
		this.commandManager = new CommandManager();
		this.listenerManager = new ListenerManager(this);
		new CommandParserModule(this);
	}
}