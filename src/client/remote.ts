// client/remote.ts

import { ReplicatedStorage } from "@rbxts/services";

export const server = ReplicatedStorage.WaitForChild("ToServerEvent") as RemoteEvent;
export const client = ReplicatedStorage.WaitForChild("ToClientEvent") as RemoteEvent;

export function requestToServer(event: string, data?: unknown[]) {
	server.FireServer({ event, data });
}
