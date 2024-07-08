import { serializeUserId } from "shared/utils";
import { store } from "./store";
import { HttpService } from "@rbxts/services";

store.registerHandler("CREATE_LOBBY", (player) => {
	if (!player) return;
	const playerId = serializeUserId(player);
	const playerState = store.getState().players[playerId];
	const lobbyId = HttpService.GenerateGUID(false);
	if (playerState) {
		store.update("lobbies", {
			...store.getState().lobbies,
			[lobbyId]: {
				owner: playerId,
				players: [playerId],
			},
		});
		print("lobby created");
	}
});

store.registerHandler("JOIN_LOBBY", (player, payload) => {});
