import { ReplicatedStorage } from "@rbxts/services";
import { ServerStore } from "shared/store";

const remoteEvent = new Instance("RemoteEvent");
remoteEvent.Name = "CatanRemoteEvent";
remoteEvent.Parent = ReplicatedStorage;

const initSharedState: SharedState = {
	lobbies: {},
};

const initServerState: ServerState = {
	players: {},
};

export const store = new ServerStore<SharedState, ServerState>(initSharedState, remoteEvent, initServerState);

print("Catan server initialized");
