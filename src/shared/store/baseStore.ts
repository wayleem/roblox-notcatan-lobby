import { Store } from "@rbxts/rodux";
import * as log from "../log";
import createGenericReducer from "./reducer";
import Object from "@rbxts/object-utils";

export default class BaseStore<A extends SharedState, B, AB = A & B> {
	protected store: Store<AB, StoreAction<AB>>;
	protected remoteEvent: RemoteEvent;
	private remoteHandlers = new Map<string, HandlerFunction<AB>>();

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

	private broadcast(action: StoreAction<A>) {
		if (game.GetService("RunService").IsServer()) {
			this.remoteEvent.FireAllClients({ event: "STORE_ACTION", data: action });
		} else {
			log.warn("Attempted to broadcast from client-side store");
		}
	}

	private handleEvent(player: Player | undefined, data: unknown) {
		if (typeIs(data, "table") && "event" in data && typeIs(data.event, "string")) {
			const handler = this.remoteHandlers.get(data.event);
			if (!handler) return log.warn(`No handler registered for event: ${data.event}`);

			try {
				handler(player, data);
			} catch (err) {
				log.warn(`Error in handler for event "${data.event}": ${err}`);
			}
		} else {
			log.warn("Invalid event data received");
		}
	}

	public registerHandler(event: string, fn: HandlerFunction<AB>) {
		if (this.remoteHandlers.has(event)) {
			log.warn(`Handler for event "${event}" is being overwritten.`);
		}
		this.remoteHandlers.set(event, fn);
	}

	public getState(): AB {
		return this.store.getState();
	}

	public subscribe(listener: (state: AB) => void): () => void {
		const connection = this.store.changed.connect(listener);
		return () => connection.disconnect();
	}

	public update<K extends keyof AB>(key: K, value: AB[K]) {
		const action: UpdateAction<AB> = { type: "UPDATE", key, value };
		this.store.dispatch(action);
		if (game.GetService("RunService").IsServer() && this.isSharedKey(key)) {
			this.broadcast(action as unknown as StoreAction<A>);
		}
	}

	public create(data: Partial<AB>) {
		const action: CreateAction<AB> = { type: "CREATE", data };
		this.store.dispatch(action);
		if (game.GetService("RunService").IsServer()) {
			const sharedData = this.filterSharedData(data);
			if (Object.keys(sharedData).size() > 0) {
				this.broadcast({ type: "CREATE", data: sharedData } as StoreAction<A>);
			}
		}
	}

	public delete<K extends keyof AB>(key: K) {
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
