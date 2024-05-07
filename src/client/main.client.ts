import { ReplicatedStorage } from "@rbxts/services";
import { MyActions } from "shared/actions";
import { makeHello } from "shared/module";
import { local_store } from "./local_store";

const serverToClientEvent = ReplicatedStorage.WaitForChild("UpdateClientEvent") as RemoteEvent;
serverToClientEvent.OnClientEvent.Connect((action: MyActions<any>) => {
	//print("Received action from server: ", action);
	local_store.dispatch(action);
});

print(makeHello("main.client.ts"));
