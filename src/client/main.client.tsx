/* client/main.client.tsx */

import "./remote";
import "./ui";

import { makeHello } from "shared/module";

print(makeHello("main.client.ts"));
