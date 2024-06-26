/* main.server.ts */

import { makeHello } from "shared/module";
import "./events";
import "./connection";
import "./remote";

print(makeHello("main.server.ts"));
