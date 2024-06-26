/* client/local_store/lobbies_reducer.ts */

import { MyActions } from "shared/actions";

export function lobbiesReducer(state: ArrayT<Lobby> = {}, action: MyActions<Lobby>): ArrayT<Lobby> {
	if (action.target === "lobbies") {
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
			case "DEL":
				const newState = { ...state };
				delete newState[action.id];
				return newState;
		}
	}
	return state;
}
