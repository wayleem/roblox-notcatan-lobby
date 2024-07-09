// types.d.ts
interface Payload<T = unknown> {
	event: string;
	data: T;
}

type HandlerFunction<AB> = (player: Player | undefined, payload: unknown) => void;

interface Lobby {
	owner: string;
	players: string[]; // Array of player IDs
}

interface PlayerState {
	currentLobby: string | undefined;
}

interface SharedState {
	lobbies: Record<string, Lobby>;
}

interface ServerState {
	players: Record<string, PlayerState>;
}
