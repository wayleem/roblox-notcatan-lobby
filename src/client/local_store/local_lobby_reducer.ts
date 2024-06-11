import { MyActions } from "shared/actions";
import { Lobby } from "shared/types";

export function local_lobby_reducer(state: Lobby = { owner: "", players: [] }, action: MyActions<Lobby>): Lobby {
	if (action.target === "lobbyui")
		switch (action.type) {
			case "CREATE":
				return state;
			case "UPDATE_KEY":
				return {
					...state,
					[action.key]: action.value,
				};
		}

	return state;
}
