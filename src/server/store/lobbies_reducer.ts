import { Players } from "@rbxts/services";
import { clients } from "server/events";
import { MyActions } from "shared/actions";
import { deserializeUserId } from "shared/utils";

export function lobbiesReducer(state: ArrayT<Lobby> = {}, action: MyActions<Lobby>): ArrayT<Lobby> {
	if (action.target === "lobbies")
		switch (action.type) {
			case "CREATE":
				clients.FireAllClients(action);
				return {
					...state,
					[action.id]: action.data,
				};
			case "MERGE":
				clients.FireAllClients(action);
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
				clients.FireAllClients(action);
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
				clients.FireAllClients(action);
				const newState = { ...state };
				delete newState[action.id];
				return newState;
			case "PING":
				const localPlayer = Players.GetPlayerByUserId(deserializeUserId(action.id));
				if (localPlayer) clients.FireClient(localPlayer, action);
				return state;
		}
	return state;
}
