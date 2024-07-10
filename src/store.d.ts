interface SharedState {
	lobbies: Record<string, Lobby>;
}

interface ServerState {
	players: Record<string, PlayerState>;
}

interface Payload<T = unknown> {
	event: string;
	data: T;
}

type HandlerFunction<AB> = (player: Player | undefined, payload: unknown) => void;
