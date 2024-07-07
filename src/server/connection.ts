/* server/connection.ts */

import { Players } from "@rbxts/services";
import { serializeUserId } from "shared/utils";
import { store } from "./store";

Players.PlayerAdded.Connect((player) => {
	const playerId = serializeUserId(player.UserId);
	store.update("players", {
		...store.getState().players,
		[playerId]: {
			currentLobby: undefined,
		},
	});
});

Players.PlayerRemoving.Connect((player) => {
	print("Player leaving:", player.Name);
});
