import { MyActions } from "shared/actions";
import Object from "@rbxts/object-utils";

export interface GuiState {
	menu: boolean;
	friends: boolean;
	server: boolean;
	lobby: boolean;
}

const initState: GuiState = { menu: true, friends: false, server: false, lobby: false };

export function gui_reducer(state: GuiState = initState, action: MyActions<GuiState>): GuiState {
	if (action.target === "gui")
		switch (action.type) {
			case "CREATE":
				state = initState;
				return state;
			case "UPDATE_KEY":
				const { key, value } = action;
				// Ensure that the value is of the correct type (boolean in this case)
				if (typeOf(value) === "boolean") {
					return {
						...state,
						[key]: value, // Update the state key with the new value
					};
				} else {
					return state; // Return the current state if the value type is incorrect
				}
			case "MERGE":
				return {
					...state,
					...action.data,
				};
		}
	return state;
}
