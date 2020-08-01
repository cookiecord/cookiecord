import { Module } from "../module";
import { MODULE_META } from "./consts";

export class MetaStore {
	constructor(private mod: Module) {}
	get store() {
		return Reflect.getMetadata(MODULE_META, this.mod) as ModuleMeta;
	}
	set store(val: ModuleMeta) {
		Reflect.defineMetadata(MODULE_META, val, this.mod);
	}
}

export interface ModuleMeta {
	triggers: string[];
}
