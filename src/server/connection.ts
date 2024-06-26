/* server/connection.ts */

import { flush } from "shared/actions";
import { store } from "server/store";
import { Players } from "@rbxts/services";
import { serializeUserId } from "shared/utils";

Players.PlayerAdded.Connect((player) => {
	print("player joined:", player.Name);
	onPlayerJoin(player);
});
Players.PlayerRemoving.Connect((player) => {
	print("Player leaving:", player.Name);
	onPlayerLeave(player);
});

function onPlayerJoin(player: Player) {
	const playerId = player.UserId;

	store.dispatch(flush(serializeUserId(playerId), store.getState().lobbies, "lobbies"));
}

function onPlayerLeave(player: Player) {}
