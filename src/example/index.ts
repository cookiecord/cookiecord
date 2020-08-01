import { Client } from "..";
import { Module } from "../module";
import dotenv from "dotenv-safe";
import { command } from "../decorators/command";
dotenv.config({
	path: "src/example/.env",
	example: "src/example/.env.example",
});
const client = new Client({ disableMentions: "everyone" });

class Main extends Module {
	@command()
	ping() {

	}
}

client.register(new Main());

client.login(process.env.TOKEN);
