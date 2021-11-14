import { Module } from "..";

export function getModuleCommands(module: Module) {
    return Array.from(module.client.commandManager.cmds).filter(
        c => c.module == module
    );
}

export function getModuleListeners(module: Module) {
    return Array.from(module.client.listenerManager.listeners).filter(
        c => c.module == module
    );
}
