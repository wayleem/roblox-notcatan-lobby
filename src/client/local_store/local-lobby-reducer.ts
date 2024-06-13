import { MyActions } from "shared/actions";
import { Lobby } from "shared/types";

const initialState: Lobby | undefined = undefined;

export function local_lobby_reducer(
	state: Lobby | undefined = initialState,
	action: MyActions<Lobby>,
): Lobby | undefined {
	if (action.target === "localLobby") {
		switch (action.type) {
			case "MERGE":
				return {
					...state,
					...action.data,
					owner: action.data.owner ?? state?.owner ?? "",
					players: action.data.players ?? state?.players ?? [],
				};
		}
	}
	return state;
}
