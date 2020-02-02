import { Command } from ".";

export default class CommandManager {
    cmds: Command[];
    constructor() {
        this.cmds = [];
    }
    add(cmd: Command) {
        if (this.cmds.includes(cmd)) return;
        const conflictingCommand = this.cmds.find(cm =>
            cmd.triggers.some(trigger => cm.triggers.includes(trigger))
        );
        if (conflictingCommand) {
            throw new Error(
                `Cannot add ${cmd.id} because it would conflict with ${conflictingCommand.id}.`
            );
        }
        this.cmds.push(cmd);
    }
    remove(cmd: Command) {
        delete this.cmds[this.cmds.findIndex(c => c == cmd)];
    }
}
