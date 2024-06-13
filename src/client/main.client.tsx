import { Players, ReplicatedStorage } from "@rbxts/services";
import { MyActions, merge } from "shared/actions";
import { makeHello } from "shared/module";
import { local_store } from "./local_store";
import Roact from "@rbxts/roact";
import Router from "./Router";

const serverToClientEvent = ReplicatedStorage.WaitForChild("UpdateClientEvent") as RemoteEvent;

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

serverToClientEvent.OnClientEvent.Connect((action: MyActions<any>) => {
	print("Received action from server: ", action);
	local_store.dispatch(action);

	if (action.target === "lobbies" && action.type === "DEL") {
		const currentLobby = local_store.getState().localLobby;
		if (currentLobby && currentLobby.owner === action.id) {
			local_store.dispatch(merge("current", {}, "localLobby"));
		}
	} else if (action.target === "lobbies" && (action.type === "MERGE" || action.type === "CREATE")) {
		const currentLobby = local_store.getState().localLobby;
		if (currentLobby && currentLobby.owner === action.id) {
			local_store.dispatch(merge("current", action.data, "localLobby"));
		}
	}
});
Players.LocalPlayer.CharacterAdded.Connect(() => {
	Roact.mount(
		<screengui IgnoreGuiInset={true}>
			<Router />
		</screengui>,
		playerGui,
		"Router",
	);
});

print(makeHello("main.client.ts"));
