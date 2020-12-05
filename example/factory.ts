import { default as CookiecordClient } from "../src";

import ReferencedModule from "./modules/referenced";

new CookiecordClient()
    .registerModuleFromFactory(c => new ReferencedModule(c, 30))
    .login(process.env.TOKEN);
