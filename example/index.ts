import CookiecordClient from "../src";
import dotenv from "dotenv-safe";
import ExampleModule from "./modules/example";
dotenv.config();

const client = new CookiecordClient({
    botAdmins: process.env.BOT_ADMINS?.split(",")
});
// new ExampleModule(client);
// client.registerModule(ExampleModule);
client.loadModulesFromFolder("modules");
client.reloadModulesFromFolder("modules");
client.login(process.env.TOKEN);
