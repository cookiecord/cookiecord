import CookiecordClient from "../src";
import dotenv from "dotenv-safe";
import ExampleModule from "./example";
dotenv.config();

const client = new CookiecordClient({ botAdmins: process.env.BOT_ADMINS?.split(",") });
// new ExampleModule(client);
client.registerModule(ExampleModule);
client.login(process.env.TOKEN);
