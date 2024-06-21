import { ReplicatedStorage } from "@rbxts/services";

export const server = new Instance("RemoteEvent", ReplicatedStorage) as RemoteEvent;
export const clients = new Instance("RemoteEvent", ReplicatedStorage) as RemoteEvent;

server.Name = "ToServerEvent";
clients.Name = "ToClientEvent";
