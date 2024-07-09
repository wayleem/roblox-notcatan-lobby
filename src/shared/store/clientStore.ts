import BaseStore from "./baseStore";

export class ClientStore<A extends SharedState> extends BaseStore<A, {}> {
	constructor(initialSharedState: A, remoteEvent: RemoteEvent) {
		super(initialSharedState, remoteEvent);
		this.requestState();

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

	sendToServer<T>(event: string, data?: T) {
		print(`Sending event to server: ${event}`, data);
		this.remoteEvent.FireServer({ event, data });
	}

	private requestState() {
		this.sendToServer("NEW_CLIENT");
	}
}
