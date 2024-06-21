import { MyActions } from "shared/actions";
import { initialRouter } from "shared/store";

export function routerReducer(state: RouterState = initialRouter, action: MyActions<RouterState>): RouterState {
	if (action.target === "router")
		switch (action.type) {
			case "MERGE":
				print("going to: " + action.data.route);
				return {
					...state,
					...action.data,
				};
		}
	return state;
}
