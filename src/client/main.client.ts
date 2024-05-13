import { Players, ReplicatedStorage } from "@rbxts/services";
import { MyActions } from "shared/actions";
import { makeHello } from "shared/module";
import { local_store } from "./local_store";
import Roact from "@rbxts/roact";

const serverToClientEvent = ReplicatedStorage.WaitForChild("UpdateClientEvent") as RemoteEvent;

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
const screenGui = playerGui.WaitForChild("ScreenGui") as ScreenGui;

serverToClientEvent.OnClientEvent.Connect((action: MyActions<any>) => {
	//print("Received action from server: ", action);
	local_store.dispatch(action);
});

print(makeHello("main.client.ts"));
