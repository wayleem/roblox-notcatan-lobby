import Roact from "@rbxts/roact";

export interface ArrayT<T> {
  [key: string]: T | undefined;
}

export interface Lobby {
  owner: string;
  players: Player[];
}

export interface Screen {
  gui: gui
  tree?: Roact.Tree
  lobby?: Lobby
}

export type gui = "menu" | "lobby" | "servers" | "friends"
