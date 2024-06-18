import { ReplicatedStorage, TeleportService } from "@rbxts/services";
import { store } from "./store";
import { Lobby } from "shared/types";
import { create, del, merge } from "shared/actions";
import { serialize_lobby } from "shared/utils";

const createLobbyEvent = ReplicatedStorage.WaitForChild("CreateLobbyEvent") as RemoteEvent;
const joinLobbyEvent = ReplicatedStorage.WaitForChild("JoinLobbyEvent") as RemoteEvent;
const leaveLobbyEvent = ReplicatedStorage.WaitForChild("LeaveLobbyEvent") as RemoteEvent;
const startGameEvent = ReplicatedStorage.WaitForChild("StartGameEvent") as RemoteEvent;
const placeId = 17410242416;

createLobbyEvent.OnServerEvent.Connect((p) => {
	const lobby: Lobby = {
		owner: tostring(p.UserId),
		players: [p],
	};
	print("new lobby by: " + lobby.owner);
	store.dispatch(create<Lobby>(lobby.owner, lobby, "lobbies"));
});

joinLobbyEvent.OnServerEvent.Connect((player, ...args: unknown[]) => {
	const lobbyOwner = args[0] as string;
	const lobbies = store.getState().lobbies as { [key: string]: Lobby };
	const lobby = lobbies[lobbyOwner];

	if (lobby) {
		const updatedLobby: Lobby = {
			...lobby,
			players: [...lobby.players, player],
		};
		print();
		store.dispatch(merge<Lobby>(lobbyOwner, updatedLobby, "lobbies"));
	}
});

leaveLobbyEvent.OnServerEvent.Connect((player) => {
	const lobbies = store.getState().lobbies as { [key: string]: Lobby };
	for (const [owner, lobby] of pairs(lobbies)) {
		if (lobby.players.includes(player)) {
			const updatedPlayers = lobby.players.filter((p) => p !== player);

			if (updatedPlayers.size() === 0) {
				// If no players are left, delete the lobby
				print("deleting lobby owned by: " + lobby.owner);

				print("server player count: " + updatedPlayers.size());
				store.dispatch(del(owner as string, "lobbies"));
			} else if (lobby.owner === tostring(player.UserId)) {
				// If the owner leaves, transfer ownership
				const newOwner = updatedPlayers[0].UserId;

				const updatedLobby: Lobby = {
					...lobby,
					owner: tostring(newOwner),
					players: updatedPlayers,
				};

				store.dispatch(merge<Lobby>(owner as string, updatedLobby, "lobbies"));
			} else {
				// Just update the players list
				const updatedLobby: Lobby = {
					...lobby,
					players: updatedPlayers,
				};

				store.dispatch(merge<Lobby>(owner as string, updatedLobby, "lobbies"));
			}
			break;
		}
	}
});

startGameEvent.OnServerEvent.Connect((player) => {
	const lobbies = store.getState().lobbies as { [key: string]: Lobby };
	for (const [owner, lobby] of pairs(lobbies)) {
		if (lobby.owner === tostring(player.UserId)) {
			// Teleport all players in the lobby to the game instance
			const players = lobby.players;
			for (const player of players) {
				TeleportService.Teleport(placeId, player);
			}
			// Optionally, delete the lobby after teleporting
			store.dispatch(del(owner as string, "lobbies"));
			break;
		}
	}
});
