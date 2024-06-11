import { Store, combineReducers } from "@rbxts/rodux";
import { lobbies_reducer } from "./lobbies-reducer";
import { gui_reducer } from "./gui-reducer";
import { local_lobby_reducer } from "./local-lobby-reducer";
import { router_reducer } from "./route-reducer";

const root_reducer = combineReducers({
	lobbies: lobbies_reducer,
	gui: gui_reducer,
	localLobby: local_lobby_reducer,
	router: router_reducer,
});

export const local_store = new Store(root_reducer);
