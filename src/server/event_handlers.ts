import { TeleportService } from "@rbxts/services";
import { store } from "./store";
import { create, del, merge } from "shared/actions";

function handleCreateLobby(player: Player) {
	const lobby: Lobby = {
		owner: tostring(player.UserId),
		players: [player],
	};
	print("new lobby by: " + lobby.owner);
	store.dispatch(create<Lobby>(lobby.owner, lobby, "lobbies"));
}

function handleJoinLobby(player: Player, data: unknown[]) {
	if (data.size() > 0) {
		const lobbyOwner = data[0] as string;
		const lobbies = store.getState().lobbies as { [key: string]: Lobby };
		const lobby = lobbies[lobbyOwner];
		print("owner: " + data + " test: " + data[0]);

		if (lobby) {
			const updatedLobby: Lobby = {
				...lobby,
				players: [...lobby.players, player],
			};
			print("player joined lobby: " + lobbyOwner);
			store.dispatch(merge<Lobby>(lobbyOwner, updatedLobby, "lobbies"));
		}
	}
}

function handleLeaveLobby(player: Player) {
	const lobbies = store.getState().lobbies as { [key: string]: Lobby };
	for (const [owner, lobby] of pairs(lobbies)) {
		if (lobby.players.includes(player)) {
			const updatedPlayers = lobby.players.filter((p) => p !== player);

			if (updatedPlayers.size() === 0) {
				print("deleting lobby owned by: " + lobby.owner);
				store.dispatch(del(owner as string, "lobbies"));
			} else if (lobby.owner === tostring(player.UserId)) {
				const newOwner = updatedPlayers[0].UserId;
				const updatedLobby: Lobby = {
					...lobby,
					owner: tostring(newOwner),
					players: updatedPlayers,
				};

				store.dispatch(merge<Lobby>(owner as string, updatedLobby, "lobbies"));
			} else {
				const updatedLobby: Lobby = {
					...lobby,
					players: updatedPlayers,
				};

				store.dispatch(merge<Lobby>(owner as string, updatedLobby, "lobbies"));
			}
			break;
		}
	}
}

function handleStartGame(player: Player) {
	const placeId = 17410242416;
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
}

export default function handleEvent(player: Player, payload: EventPayload) {
	const { event, data } = payload;
	print("Event received from client: " + event);
	print("Data received: ", data);

	switch (event) {
		case "CREATE_LOBBY":
			handleCreateLobby(player);
			break;
		case "JOIN_LOBBY":
			if (data) {
				handleJoinLobby(player, data);
			}
			break;
		case "LEAVE_LOBBY":
			handleLeaveLobby(player);
			break;
		case "START_GAME":
			handleStartGame(player);
			break;
		default:
			print("Unknown event: ", event);
			break;
	}
}
