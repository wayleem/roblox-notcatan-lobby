import { Store, combineReducers } from "@rbxts/rodux";
import { lobbies_reducer } from "./lobbies_reducer";
import { gui_reducer } from "./gui_reducer";
import { local_lobby_reducer } from "./local_lobby_reducer";

const root_reducer = combineReducers({
	lobbies: lobbies_reducer,
	gui: gui_reducer,
	local_lobby: local_lobby_reducer,
});

export const local_store = new Store(root_reducer);
