/* main.server.ts */

import { makeHello } from "shared/module";
import "./connection";
import "./lobby/lobbyHandler";

print(makeHello("main.server.ts"));
