import chokidar from "chokidar";
import { Client, ClientOptions, Intents, Message } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Module } from ".";
import CommandManager from "./command/commandManager";
import CommandParserModule from "./command/commandParser";
import ListenerManager from "./listener/listenerManager";
import { ArgTypes } from "./util/argTypeProvider";
import Events from "./util/clientEvents";
type Prefix = string | string[];
type PrefixProvider = (msg: Message) => Prefix | Promise<Prefix>;
interface CookiecordOptions {
    botAdmins: string[];
    commandArgumentTypes: ArgTypes;
    prefix: PrefixProvider | Prefix;
}
class CookiecordClient extends Client {
    public commandManager: CommandManager;
    public listenerManager: ListenerManager;
    public modules: Set<Module> = new Set();
    readonly botAdmins: string[];
    readonly commandArgumentTypes: ArgTypes;
    readonly prefix: PrefixProvider;

    constructor(
        opts: Partial<CookiecordOptions> = {},
        discordOpts: ClientOptions = {
            // This is an incomplete list but it should work well enough for most
            // bots.
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS
            ]
        }
    ) {
        super(discordOpts);
        this.botAdmins = opts.botAdmins || [];
        this.commandManager = new CommandManager();
        this.listenerManager = new ListenerManager(this);
        this.commandArgumentTypes = opts.commandArgumentTypes || {};
        if (!opts.prefix) {
            this.prefix = () => "cc!";
        } else {
            const op = opts.prefix;
            if (Array.isArray(op) || typeof op == "string") {
                this.prefix = () => op;
            } else {
                this.prefix = op;
            }
        }
        this.registerModule(CommandParserModule);
    }
    async getPrefix(msg: Message) {
        let prefix = this.prefix(msg);
        if (prefix instanceof Promise) {
            prefix = await prefix;
        }
        return prefix;
    }

    registerModule(module: typeof Module | Module) {
        if (module == Module || module instanceof Module)
            throw new TypeError(
                "registerModule only takes in classes that extend Module"
            );
        if (
            Array.from(this.modules).some(
                (m) =>
                    m.constructor.name == module.name ||
                    m.constructor.name == module.constructor.name
            )
        )
            throw new Error(
                `cannot register multiple modules with same name (${
                    module.name || module.constructor.name
                })`
            );
        const mod = module instanceof Module ? module : new module(this);
        this.registerModuleInstance(mod);
        return this;
    }

    registerModuleInstance(instance: Module) {
        if (!(instance instanceof Module))
            throw new TypeError(
                "registerModuleInstance only takes in instances of Module"
            );
        if (
            Array.from(this.modules).some(
                (m) => m.constructor.name == instance.constructor.name
            )
        )
            throw new Error(
                `cannot register multiple modules with same name (${instance.constructor.name})`
            );
        instance.processListeners
            .bind(instance)()
            .forEach((l) => this.listenerManager.add(l));
        instance.processCommands
            .bind(instance)()
            .forEach((c) => this.commandManager.add(c));
        this.modules.add(instance);
        return this;
    }

    registerModuleFromFactory(factory: (client: CookiecordClient) => Module) {
        this.registerModuleInstance(factory(this));
        return this;
    }

    unregisterModule(mod: Module) {
        if (!this.modules.has(mod))
            throw new Error("Cannot unregister unregistered module");
        Array.from(this.listenerManager.listeners)
            .filter((l) => l.module == mod)
            .forEach((l) => this.listenerManager.remove(l));
        Array.from(this.commandManager.cmds)
            .filter((c) => c.module == mod)
            .forEach((c) => this.commandManager.remove(c));
        this.modules.delete(mod);
        return this;
    }

    reloadModulesFromFolder(path: string) {
        const fn = join(process.cwd(), path);
        const watcher = chokidar.watch(fn);

        watcher.on("change", (file) => {
            // Here be dragons.
            // Might need more validation here...

            // We may restore fileCache later if the new `require` fails
            const fileCache = require.cache[file];
            delete require.cache[file];

            try {
                const module = require(file) as {
                    default: typeof Module;
                };
                if (module.default) {
                    if (Object.getPrototypeOf(module.default) == Module) {
                        const old = Array.from(this.modules).find(
                            (mod) => module.default.name == mod.constructor.name
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
                    throw new Error(
                        `Module ${file} doesn't have a default export`
                    );
                }
            } catch (error) {
                if (error instanceof Error) {
                    const constructor = error.constructor;
                    // SyntaxError is built-in, TSError is ts-node's tsc compile error
                    if (
                        constructor &&
                        (constructor.name == "TSError" ||
                            constructor.name == "SyntaxError")
                    ) {
                        require.cache[file] = fileCache;
                        console.error(error);
                    } else {
                        throw error;
                    }
                }
            }
        });
    }

    loadModulesFromFolder(path: string) {
        const files = readdirSync(path);
        files.forEach((file) => {
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
interface CookiecordClient {
    on<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void
    ): this;

    once<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void
    ): this;

    emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean;
}
export default CookiecordClient;
