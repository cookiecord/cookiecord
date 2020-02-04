import { Client, ClientOptions } from "discord.js";
import { Command, Module } from ".";
import CommandManager from "./command/commandManager";
import CommandParserModule, { ArgTypes } from "./command/commandParser";
import ListenerManager from "./listener/listenerManager";
interface CookiecordOptions {
    botAdmins?: string[];
    commandArgumentTypes?: ArgTypes;
    commandPrefix?: string;
}
export default class CookiecordClient extends Client {
    private commandManager: CommandManager;
    private modules: Set<Module> = new Set();
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
        this.modules.add(mod);
        return this;
    }
    unregisterModule(mod: Module) {
        if (!this.modules.has(mod))
            throw new Error("Cannot register unregistered module");
        this.listenerManager.listeners
            .filter(l => l.module == mod)
            .forEach(l => this.listenerManager.remove(l));
        this.commandManager.cmds
            .filter(c => c.module == mod)
            .forEach(c => this.commandManager.remove(c));
        this.modules.delete(mod);
        return this;
    }
}
