import { serializeUserId } from "shared/utils";
import { HttpService } from "@rbxts/services";
import { store } from "server/store";
import getLobbyId from "./getLobbyId";
import deleteLobby from "./deleteLobby";
import updateLobby from "./updateLobby";
import updatePlayer from "./updatePlayer";

store.registerHandler("CREATE_LOBBY", (player) => {
	if (!player) return;
	const playerId = serializeUserId(player);
	const playerState = store.getState().players[playerId];
	const lobbyId = HttpService.GenerateGUID(false);
	if (playerState) {
		store.update("lobbies", {
			...store.getState().lobbies,
			[lobbyId]: {
				owner: playerId,
				players: [playerId],
			},
		});
		print("lobby created");
	}
});

store.registerHandler("LEAVE_LOBBY", (player, payload: unknown) => {
	if (!player) return;

	const playerId = serializeUserId(player);
	const lobbyId = getLobbyId(payload);

	if (!lobbyId) {
		warn("LEAVE_LOBBY: Unable to extract lobby ID from payload", payload);
		return;
	}

	const currentState = store.getState();
	const lobby = currentState.lobbies[lobbyId];

	if (!lobby) {
		warn(`LEAVE_LOBBY: Lobby ${lobbyId} not found`);
		return;
	}

	print(`Player ${playerId} attempting to leave lobby ${lobbyId}`);

	const updatedLobbyPlayers = lobby.players.filter((id) => id !== playerId);

	if (updatedLobbyPlayers.size() === 0) {
		deleteLobby(store, currentState, lobbyId);
	} else {
		updateLobby(store, currentState, lobbyId, updatedLobbyPlayers, playerId);
	}

	updatePlayer(store, currentState, playerId);

	print(`Player ${playerId} successfully left lobby ${lobbyId}`);
});

const MAX_PLAYERS_PER_LOBBY = 4; // Adjust this value as needed

store.registerHandler("JOIN_LOBBY", (player, payload: unknown) => {
	if (!player) return;

	const playerId = serializeUserId(player);
	const lobbyId = getLobbyId(payload);

	if (!lobbyId) {
		warn("JOIN_LOBBY: Unable to extract lobby ID from payload", payload);
		return;
	}

	const currentState = store.getState();
	const lobby = currentState.lobbies[lobbyId];

	if (!lobby) {
		warn(`JOIN_LOBBY: Lobby ${lobbyId} not found`);
		return;
	}

	if (lobby.players.includes(playerId)) {
		print(`Player ${playerId} is already in lobby ${lobbyId}`);
		return;
	}

	if (lobby.players.size() >= MAX_PLAYERS_PER_LOBBY) {
		warn(`JOIN_LOBBY: Lobby ${lobbyId} is full`);
		return;
	}

	const updatedLobbyPlayers = [...lobby.players, playerId];

	updateLobby(store, currentState, lobbyId, updatedLobbyPlayers, playerId);
	updatePlayer(store, currentState, playerId, lobbyId);

	print(`Player ${playerId} successfully joined lobby ${lobbyId}`);
});
