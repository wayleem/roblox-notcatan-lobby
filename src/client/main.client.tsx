import { Players, ReplicatedStorage } from "@rbxts/services";
import { MyActions } from "shared/actions";
import { makeHello } from "shared/module";
import { local_store } from "./local_store";
import Roact from "@rbxts/roact";
import Router from "./Router";

const serverToClientEvent = ReplicatedStorage.WaitForChild("UpdateClientEvent") as RemoteEvent;

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

serverToClientEvent.OnClientEvent.Connect((action: MyActions<any>) => {
	//print("Received action from server: ", action);
	local_store.dispatch(action);
});

Players.LocalPlayer.CharacterAdded.Connect(() => {
	print("gui load");
	Roact.mount(<Router />, playerGui, "Router");
});

print(makeHello("main.client.ts"));
