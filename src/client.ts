import { Client, ClientOptions } from "discord.js";
import { Command, Module } from ".";
import CommandManager from "./command/commandManager";
import CommandParserModule, { ArgTypes } from "./command/commandParser";
import ListenerManager from "./listener/listenerManager";
import chokidar from "chokidar";
import { readdirSync } from "fs";
import { join } from "path";
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
        return Array.from(this.commandManager.cmds).find(c =>
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
            throw new Error("Cannot unregister unregistered module");
        Array.from(this.listenerManager.listeners)
            .filter(l => l.module == mod)
            .forEach(l => this.listenerManager.remove(l));
        Array.from(this.commandManager.cmds)
            .filter(c => c.module == mod)
            .forEach(c => this.commandManager.remove(c));
        this.modules.delete(mod);
        return this;
    }
    reloadModulesFromFolder(path: string) {
        const fn = join(process.cwd(), path);
        const watcher = chokidar.watch(fn);

        watcher.on("change", file => {
            // WARNING: Unsafe not very TS protected code up ahead!
            // Might need more validation here...
            delete require.cache[file];
            const module = require(file) as { default: typeof Module };
            if (module.default) {
                if (Object.getPrototypeOf(module.default) == Module) {
                    const old = Array.from(this.modules).find(
                        mod => module.default.name == mod.constructor.name
                    );
                    if (old) this.unregisterModule(old);
                    this.registerModule(module.default);
                    console.log(`Auto reloaded module in file ${file}`);
                } else {
                    throw new TypeError(
                        `Module ${file}'s default export is not of a Module.`
                    );
                }
            } else {
                throw new Error(`Module ${file} doesn't have a default export`);
            }
        });
    }
    loadModulesFromFolder(path: string) {
        const files = readdirSync(path);
        files.forEach(file => {
            const fn = join(process.cwd(), path, file);
            const module = require(fn);
            if (module.default) {
                if (Object.getPrototypeOf(module.default) == Module) {
                    this.registerModule(module.default);
                } else {
                    throw new TypeError(
                        `Module ${fn}'s default export is not of a Module.`
                    );
                }
            } else {
                throw new Error(`Module ${fn} doesn't have a default export`);
            }
        });
    }
}
