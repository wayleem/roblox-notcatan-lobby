/* types.d.ts */

interface ArrayT<T> {
	[key: string]: T | undefined;
}

interface Lobby {
	id: string;
	owner: string;
	players: Player[];
}

interface EventPayload {
	data?: unknown[];
	event: string;
}

type Route = "menu" | "friends" | "server" | "lobby";
