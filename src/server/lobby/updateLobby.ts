import { ServerStore } from "shared/store";

export default function updateLobby(
	store: ServerStore<SharedState, ServerState>,
	currentState: ServerState & SharedState,
	lobbyId: string,
	updatedPlayers: string[],
	leavingPlayerId: string,
) {
	const updatedLobbies = { ...currentState.lobbies };
	const currentLobby = currentState.lobbies[lobbyId];
	updatedLobbies[lobbyId] = {
		...currentLobby,
		players: updatedPlayers,
		owner: currentLobby.owner === leavingPlayerId ? updatedPlayers[0] : currentLobby.owner,
	};
	store.update("lobbies", updatedLobbies);
	print(`Lobby ${lobbyId} updated. New player count: ${updatedPlayers.size()}`);
}
