export function debug(...msg: unknown[]) {
	if (process.env.DEBUG !== "cookiecord") return;
	console.log(...msg);
}