// types.d.ts

interface Lobby {
	owner: string;
	players: string[]; // Array of player IDs
}

interface PlayerState {
	currentLobby: string | undefined;
}

interface Payload<T = unknown> {
	event: string;
	data: T;
}

interface SharedState {
	lobbies: Record<string, Lobby>;
}

interface ServerState {
	players: Record<string, PlayerState>;
}
