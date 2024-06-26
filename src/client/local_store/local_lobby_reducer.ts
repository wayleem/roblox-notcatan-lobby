/* client/local_store/local_lobby_reducer.ts */

import { MyActions } from "shared/actions";
import { initLobbyState } from "shared/store";

export function localLobbyReducer(state: Lobby = initLobbyState, action: MyActions<Lobby>): Lobby {
	if (action.target === "localLobby") {
		switch (action.type) {
			case "MERGE":
				return {
					...state,
					...action.data,
					owner: action.data.owner ?? state.owner,
					players: action.data.players ?? state.players,
				};
		}
	}
	return state;
}
