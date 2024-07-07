import { store } from "./store";

store.registerHandler("CREATE_LOBBY", (player, lobby) => {
	if (!player) return;
});

function createLobby(lobby: Lobby) {
	store.update("lobbies", { ...store.getState().lobbies, [lobby.id]: lobby });
}

function joinLobby(lobby: Lobby) {}
