import { ServerStore } from "shared/store";

export default function updatePlayer(
	store: ServerStore<SharedState, ServerState>,
	currentState: ServerState & SharedState,
	playerId: string,
	lobbyId?: string,
) {
	const updatedPlayers = { ...currentState.players };
	if (updatedPlayers[playerId]) {
		updatedPlayers[playerId] = {
			...updatedPlayers[playerId],
			currentLobby: lobbyId,
		};
		store.update("players", updatedPlayers);
		print(`Player ${playerId} state updated. Current lobby set to ${lobbyId || "undefined"}.`);
	}
}
