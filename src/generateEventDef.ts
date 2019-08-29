import { writeFileSync } from "fs";
const Events: object = require("discord.js/src/util/Constants.js").Events;

const def = "type Event = " + Object.values(Events).map(s => `"${s}"`).join(" | ");
writeFileSync("src/event.ts", def + "\nexport default Event");