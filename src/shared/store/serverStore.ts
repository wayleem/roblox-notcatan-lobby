import BaseStore from "./baseStore";

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
