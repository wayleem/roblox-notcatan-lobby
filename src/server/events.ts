import { ReplicatedStorage } from "@rbxts/services";
import { store } from "./store";
import { Lobby } from "shared/types";
import { create } from "shared/actions";
import { serialize_lobby } from "shared/utils";

const createLobbyEvent = ReplicatedStorage.WaitForChild("CreateLobbyEvent") as RemoteEvent;

createLobbyEvent.OnServerEvent.Connect((p) => {
  const lobby: Lobby = {
    owner: tostring(p.UserId),
    players: [p],
  };
  store.dispatch(create<Lobby>(lobby.owner, lobby, "lobbies"));
});
