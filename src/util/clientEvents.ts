import { Context } from "..";
import { ClientEvents } from "discord.js";

export default interface Events extends ClientEvents {
	commandExecution: [Context]
}

export type Event = keyof Events;
