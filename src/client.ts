import { Client, ClientOptions } from "discord.js";
import CommandManager from "./command/commandManager";
import ListenerManager from "./listener/listenerManager";
import CommandParserModule, { ArgTypes } from "./command/commandParser";
import { Module, Command } from ".";
interface CookiecordOptions {
    botAdmins?: string[];
    commandArgumentTypes?: ArgTypes;
    commandPrefix?: string;
}
export default class CookiecordClient extends Client {
    private commandManager: CommandManager;
    private listenerManager: ListenerManager;
    readonly botAdmins: string[];
    readonly commandPrefix: string;
    readonly commandArgumentTypes: ArgTypes;
    constructor(opts: CookiecordOptions = {}, discordOpts: ClientOptions = {}) {
        super(discordOpts);
        this.botAdmins = opts.botAdmins || [];
        this.commandPrefix = opts.commandPrefix || "cc!";
        this.commandManager = new CommandManager();
        this.listenerManager = new ListenerManager(this);
        this.commandArgumentTypes = opts.commandArgumentTypes || {};
        this.registerModule(CommandParserModule);
    }
    getCommandByTrigger(cmdTrigger: string): Command | undefined {
        return this.commandManager.cmds.find(c =>
            c.triggers.includes(cmdTrigger)
        );
    }
    registerModule(module: typeof Module) {
        if (module.name == "Module")
            throw new Error(
                "Please pass in your module and not the parent Module class."
            );
        const mod = new module(this);
        mod.processListeners
            .bind(mod)()
            .forEach(l => this.listenerManager.add(l));
        mod.processCommands
            .bind(mod)()
            .forEach(c => this.commandManager.add(c));
    }
}
