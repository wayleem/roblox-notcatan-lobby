import { Store, combineReducers } from "@rbxts/rodux";
import { lobbies_reducer } from "./lobbies_reducer";

const root_reducer = combineReducers({
	lobbies: lobbies_reducer,
});

export const local_store = new Store(root_reducer);
