import { ReplicatedStorage } from "@rbxts/services";
import { ClientStore } from "shared/store";

const remoteEvent = ReplicatedStorage.WaitForChild("CatanRemoteEvent") as RemoteEvent;

const initSharedState: SharedState = {
	lobbies: {},
};

export const clientStore = new ClientStore<SharedState>(initSharedState, remoteEvent);

print("Catan client initialized");
