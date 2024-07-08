/* client/main.client.tsx */

import Object from "@rbxts/object-utils";
import { clientStore } from "./store";
import "./ui";

import { makeHello } from "shared/module";

wait(5);
print(Object.entries(clientStore.getState().lobbies));

print(makeHello("main.client.ts"));
