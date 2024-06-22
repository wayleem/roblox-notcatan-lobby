interface ArrayT<T> {
	[key: string]: T | undefined;
}

interface Lobby {
	owner: string;
	players: Player[];
}

interface EventPayload {
	data?: unknown[];
	event: string;
}

type Route = "menu" | "friends" | "server" | "lobby";
