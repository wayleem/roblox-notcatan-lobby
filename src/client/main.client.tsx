import { Players, ReplicatedStorage } from "@rbxts/services";
import { MyActions, create } from "shared/actions";
import { makeHello } from "shared/module";
import { local_store } from "./local_store";
import MenuGui from "./ui/MenuGui";
import Roact from "@rbxts/roact";
import FriendListGui from "./ui/FriendListGui";
import ServerListGui from "./ui/ServerListGui";

const serverToClientEvent = ReplicatedStorage.WaitForChild("UpdateClientEvent") as RemoteEvent;

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

serverToClientEvent.OnClientEvent.Connect((action: MyActions<any>) => {
	//print("Received action from server: ", action);
	local_store.dispatch(action);
});

Players.LocalPlayer.CharacterAdded.Connect(() => {
	print("gui load");
	const guiState = local_store.getState().gui;
	Roact.mount(
		<screengui>
			<MenuGui />
			<FriendListGui isVisible={guiState === "friends"} />
			<ServerListGui isVisible={guiState === "servers"} />
		</screengui>,
		playerGui,
	);
});

print(makeHello("main.client.ts"));
