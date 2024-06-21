import { ReplicatedStorage } from "@rbxts/services";
import { merge, type MyActions } from "shared/actions";
import { local_store } from "./local_store";

export const server = ReplicatedStorage.WaitForChild("ToServerEvent") as RemoteEvent;
export const client = ReplicatedStorage.WaitForChild("ToClientEvent") as RemoteEvent;

client.OnClientEvent.Connect((action: MyActions<any>) => {
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
