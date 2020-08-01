import { debug } from "../util/debug";
import { Module } from "../module";
import { inspect } from "util";

export function command(opts: {} = {}) {
	return (
		target: unknown,
		propKey: string,
		descriptor: PropertyDescriptor
	) => {
		debug(
			`command(${inspect(opts)})=>(${inspect(
				target
			)}, ${propKey}, ${inspect(descriptor)})`
		);
		if (!(target instanceof Module))
			throw new TypeError(
				`expected decorator to be used on Module, got ${target}`
			);
	};
}
