import Roact from "@rbxts/roact";

export interface ArrayT<T> {
	[key: string]: T | undefined;
}

export interface Lobby {
	owner: string;
	players: Player[];
}

export type gui = "menu" | "lobby" | "servers" | "friends";
