import CookiecordClient from "../src";
import de from "dotenv";
import ExampleModule from "./example";
de.config();

const client = new CookiecordClient({}, {});
new ExampleModule(client);
client.login(process.env.TOKEN);
