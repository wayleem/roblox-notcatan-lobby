/* client/local_store/index.ts */

import { Store, combineReducers } from "@rbxts/rodux";
import { lobbiesReducer } from "./lobbies_reducer";
import { localLobbyReducer } from "./local_lobby_reducer";
import { routerReducer } from "./route_reducer";

const rootReducer = combineReducers({
	lobbies: lobbiesReducer,
	localLobby: localLobbyReducer,
	router: routerReducer,
});

export const local_store = new Store(rootReducer);
