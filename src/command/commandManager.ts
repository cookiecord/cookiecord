import { Command } from ".";

export default class CommandManager {
    cmds: Set<Command> = new Set();
    add(cmd: Command) {
        if (Array.from(this.cmds).includes(cmd)) return;
        const conflictingCommand = Array.from(this.cmds).find(cm =>
            cmd.triggers.some(trigger => cm.triggers.includes(trigger))
        );
        if (conflictingCommand) {
            throw new Error(
                `Cannot add ${cmd.id} because it would conflict with ${conflictingCommand.id}.`
            );
        }
        this.cmds.add(cmd);
    }
    remove(cmd: Command) {
        this.cmds.delete(cmd);
    }
}
