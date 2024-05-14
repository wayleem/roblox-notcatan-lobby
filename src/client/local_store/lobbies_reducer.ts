import { MyActions } from "shared/actions";
import { ArrayT, Lobby } from "shared/types";

export interface LobbiesState {
	lobbies: ArrayT<Lobby>;
}

export function lobbies_reducer(state: ArrayT<Lobby> = {}, action: MyActions<Lobby>): ArrayT<Lobby> {
	if (action.target === "lobbies")
		switch (action.type) {
			case "CREATE":
				return {
					...state,
					[action.id]: action.data,
				};
			case "MERGE":
				const currentState = state[action.id];
				if (currentState) {
					return {
						...state,
						[action.id]: {
							...currentState,
							...action.data,
						},
					};
				}
				return state;
			case "UPDATE_KEY":
				const keyToUpdate = state[action.id];
				if (keyToUpdate && action.key in keyToUpdate) {
					return {
						...state,
						[action.id]: {
							...keyToUpdate,
							[action.key]: action.value,
						},
					};
				}
				return state;
		}
	return state;
}
