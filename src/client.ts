import { Client, ClientOptions } from "discord.js";
import { Module } from "./module";
import { debug } from "./util/debug";
import { inspect } from "util";
export interface CookiecordOptions { }
export class CookiecordClient extends Client {
	constructor(opts: ClientOptions & CookiecordOptions) {
		super(opts);
	}
	register(module: Module) {
		debug(`register(${inspect(module)})`);
		return module;
	}
}
