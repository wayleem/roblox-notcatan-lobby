import BaseStore from "./baseStore";

export class ClientStore<A extends SharedState> extends BaseStore<A, {}> {
	constructor(initialSharedState: A, remoteEvent: RemoteEvent) {
		super(initialSharedState, remoteEvent);
		this.remote("NEW_CLIENT");

		this.registerHandler("STORE_ACTION", (_, payload) => {
			if (typeIs(payload, "table") && "data" in payload) {
				const action = payload.data as StoreAction<A>;
				print("Received store action:", action);
				this.store.dispatch(action);
			}
		});

		this.registerHandler("FLUSH", (_, payload) => {
			if (typeIs(payload, "table") && "data" in payload) {
				this.store.dispatch({ type: "CREATE", data: payload.data as A });
			}
		});
	}

	remote<T>(event: string, data?: T) {
		this.remoteEvent.FireServer({ event, data });
	}
}
