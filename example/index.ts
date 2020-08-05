import CookiecordClient, { HelpModule } from "../src";
import dotenv from "dotenv-safe";
dotenv.config();

const client = new CookiecordClient({
    botAdmins: process.env.BOT_ADMINS?.split(","),
    prefix: "!"
});
// new ExampleModule(client);
// client.registerModule(ExampleModule);
client.registerModule(HelpModule);
client.loadModulesFromFolder("modules");
client.reloadModulesFromFolder("modules");
client.login(process.env.TOKEN);
