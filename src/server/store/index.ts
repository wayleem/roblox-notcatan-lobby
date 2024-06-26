/* server/store/index.ts */

import { Store, combineReducers } from "@rbxts/rodux";
import { lobbiesReducer } from "./lobbies_reducer";

const rootReducer = combineReducers({
	lobbies: lobbiesReducer,
});

export const store = new Store(rootReducer);
