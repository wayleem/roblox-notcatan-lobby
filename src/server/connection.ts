import { create, del, flush } from "shared/actions";
import { store } from "server/store";
import { Players } from "@rbxts/services";
import Object from "@rbxts/object-utils";
import { serialize_userid } from "shared/utils";

Players.PlayerAdded.Connect((player) => {
	print("player joined:", player.Name);
	on_player_join(player);
});
Players.PlayerRemoving.Connect((player) => {
	print("Player leaving:", player.Name);
	on_player_leave(player);
});

function on_player_join(player: Player) {
	const playerId = player.UserId;

	store.dispatch(flush(serialize_userid(playerId), store.getState().lobbies, "lobbies"));
}

function on_player_leave(player: Player) {}
