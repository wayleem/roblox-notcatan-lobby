import Object from "@rbxts/object-utils";
import { Store, Action, createReducer } from "@rbxts/rodux";

// Define action types
interface UpdateAction<T> extends Action<"UPDATE"> {
	key: keyof T;
	value: T[keyof T];
}

interface CreateAction<T> extends Action<"CREATE"> {
	data: Partial<T>;
}

interface DeleteAction<T> extends Action<"DELETE"> {
	key: keyof T;
}

type StoreAction<T> = UpdateAction<T> | CreateAction<T> | DeleteAction<T>;

// Create a generic reducer
function createGenericReducer<T>() {
	return createReducer<T, StoreAction<T>>({} as T, {
		UPDATE: (state, action) => ({
			...state,
			[action.key]: action.value,
		}),
		CREATE: (state, action) => ({
			...state,
			...action.data,
		}),
		DELETE: (state, action) => {
			const newState = { ...state };
			delete newState[action.key];
			return newState;
		},
	});
}

type HandlerFunction<AB> = (player: Player | undefined, payload: unknown) => void;

// Base store class
class BaseStore<A extends SharedState, B, AB = A & B> {
	protected store: Store<AB, StoreAction<AB>>;
	protected remoteEvent: RemoteEvent;
	private handlers = new Map<string, HandlerFunction<AB>>();

	constructor(initialSharedState: A, remoteEvent: RemoteEvent, serverState?: B) {
		const initialState = serverState
			? ({ ...initialSharedState, ...serverState } as AB)
			: (initialSharedState as unknown as AB);

		this.store = new Store<AB, StoreAction<AB>>(createGenericReducer<AB>(), initialState);
		this.remoteEvent = remoteEvent;

		if (game.GetService("RunService").IsServer()) {
			this.remoteEvent.OnServerEvent.Connect((player: Player, data: unknown) => {
				this.handleEvent(player, data);
			});
		} else {
			this.remoteEvent.OnClientEvent.Connect((data: unknown) => {
				this.handleEvent(undefined, data);
			});
		}
	}

	private handleEvent(player: Player | undefined, data: unknown) {
		if (typeIs(data, "table") && "event" in data && typeIs(data.event, "string")) {
			const handler = this.handlers.get(data.event);
			if (handler) {
				try {
					handler(player, data);
				} catch (err) {
					warn(`Error in handler for event "${data.event}": ${err}`);
				}
			} else {
				warn(`No handler registered for event: ${data.event}`);
			}
		} else {
			warn("Invalid event data received");
		}
	}

	registerHandler(event: string, fn: HandlerFunction<AB>) {
		if (this.handlers.has(event)) {
			warn(`Handler for event "${event}" is being overwritten.`);
		}
		this.handlers.set(event, fn);
	}

	getState(): AB {
		return this.store.getState();
	}

	protected broadcast(action: StoreAction<A>) {
		if (game.GetService("RunService").IsServer()) {
			this.remoteEvent.FireAllClients({ event: "STORE_ACTION", data: action });
		} else {
			warn("Attempted to broadcast from client-side store");
		}
	}

	update<K extends keyof AB>(key: K, value: AB[K]) {
		const action: UpdateAction<AB> = { type: "UPDATE", key, value };
		this.store.dispatch(action);
		if (game.GetService("RunService").IsServer() && this.isSharedKey(key)) {
			this.broadcast(action as unknown as StoreAction<A>);
		}
	}

	create(data: Partial<AB>) {
		const action: CreateAction<AB> = { type: "CREATE", data };
		this.store.dispatch(action);
		if (game.GetService("RunService").IsServer()) {
			const sharedData = this.filterSharedData(data);
			if (Object.keys(sharedData).size() > 0) {
				this.broadcast({ type: "CREATE", data: sharedData } as StoreAction<A>);
			}
		}
	}

	delete<K extends keyof AB>(key: K) {
		const action: DeleteAction<AB> = { type: "DELETE", key };
		this.store.dispatch(action);
		if (game.GetService("RunService").IsServer() && this.isSharedKey(key)) {
			this.broadcast(action as unknown as StoreAction<A>);
		}
	}

	private isSharedKey<K extends keyof AB>(key: K): key is K & keyof A {
		return key in (this.getState() as unknown as A);
	}

	private filterSharedData(data: Partial<AB>): Partial<A> {
		return Object.entries(data).reduce((acc, [key, value]) => {
			if (this.isSharedKey(key as keyof AB)) {
				acc[key as keyof A] = value as A[keyof A];
			}
			return acc;
		}, {} as Partial<A>);
	}
}

export class ServerStore<A extends SharedState, B extends ServerState> extends BaseStore<A, B> {
	constructor(initialSharedState: A, remoteEvent: RemoteEvent, serverState: B) {
		super(initialSharedState, remoteEvent, serverState);

		this.registerHandler("NEW_CLIENT", (player) => {
			if (player) {
				this.flushClient(player);
			}
		});
	}

	flushClient(player: Player) {
		const sharedState = this.getState() as A; // Only send shared state to client
		this.remoteEvent.FireClient(player, { event: "FLUSH", data: sharedState });
	}
}

export class ClientStore<A extends SharedState> extends BaseStore<A, {}> {
	constructor(initialSharedState: A, remoteEvent: RemoteEvent) {
		super(initialSharedState, remoteEvent);
		this.requestState();

		this.registerHandler("STORE_ACTION", (_, payload) => {
			if (typeIs(payload, "table") && "data" in payload) {
				this.store.dispatch(payload.data as StoreAction<A>);
			}
		});

		this.registerHandler("FLUSH", (_, payload) => {
			if (typeIs(payload, "table") && "data" in payload) {
				this.store.dispatch({ type: "CREATE", data: payload.data as A });
			}
		});
	}

	sendToServer(event: string, data?: unknown) {
		this.remoteEvent.FireServer({ event, data });
	}

	private requestState() {
		this.sendToServer("NEW_CLIENT");
	}
}
