/* client/remote.ts */

import { ReplicatedStorage } from "@rbxts/services";
import { merge, MyActions } from "shared/actions";
import { local_store } from "./local_store";

export const server = ReplicatedStorage.WaitForChild("ToServerEvent") as RemoteEvent;
export const client = ReplicatedStorage.WaitForChild("ToClientEvent") as RemoteEvent;

client.OnClientEvent.Connect((action: MyActions<any>) => {
	print("Received action from server: ", action);
	local_store.dispatch(action);
});
