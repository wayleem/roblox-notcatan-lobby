import { ServerStore } from "shared/store";

export default function deleteLobby(
	store: ServerStore<SharedState, ServerState>,
	currentState: ServerState & SharedState,
	lobbyId: string,
) {
	const updatedLobbies = { ...currentState.lobbies };
	delete updatedLobbies[lobbyId];
	store.update("lobbies", updatedLobbies);
	print(`Lobby ${lobbyId} removed. Updated lobbies:`, updatedLobbies);
}
