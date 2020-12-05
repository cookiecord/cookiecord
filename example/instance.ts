import { default as CookiecordClient } from "../src";

import ReferencedModule from "./modules/referenced";

const c = new CookiecordClient();
c.registerModuleInstance(new ReferencedModule(c, 60));
c.login(process.env.TOKEN);
