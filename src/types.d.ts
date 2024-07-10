// types.d.ts

interface Lobby {
	owner: string;
	players: string[]; // Array of player IDs
}

interface PlayerState {
	currentLobby: string | undefined;
}
