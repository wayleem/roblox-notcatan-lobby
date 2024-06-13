import Object from "@rbxts/object-utils";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { MyActions } from "shared/actions";
import { ArrayT, Lobby } from "shared/types";
import { deserialize_userid } from "shared/utils";

export interface LobbiesState {
	lobbies: ArrayT<Lobby>;
}

const remoteEvent = ReplicatedStorage.WaitForChild("UpdateClientEvent") as RemoteEvent;

export function lobbies_reducer(state: ArrayT<Lobby> = {}, action: MyActions<Lobby>): ArrayT<Lobby> {
	if (action.target === "lobbies")
		switch (action.type) {
			case "CREATE":
				remoteEvent.FireAllClients(action);
				return {
					...state,
					[action.id]: action.data,
				};
			case "MERGE":
				remoteEvent.FireAllClients(action);
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
				remoteEvent.FireAllClients(action);
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
				remoteEvent.FireAllClients(action);
				const newState = { ...state };
				delete newState[action.id];
				return newState;
			case "PING":
				const localPlayer = Players.GetPlayerByUserId(deserialize_userid(action.id));
				if (localPlayer) remoteEvent.FireClient(localPlayer, action);
				return state;
		}
	return state;
}
