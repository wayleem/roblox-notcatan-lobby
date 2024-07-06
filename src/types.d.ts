// types.d.ts

interface Lobby {
	id: string;
	owner: string;
	players: string[]; // Array of player IDs
}

type Route = "menu" | "friends" | "server" | "lobby";

interface PlayerState {
	currentLobby: string | null;
	route: Route;
}

interface Payload<T = unknown> {
	event: string;
	data: T;
}

interface SharedState {
	lobbies: Record<string, Lobby>;
	router: {
		route: Route;
	};
}

interface ServerState {
	players: Record<string, PlayerState>;
}
