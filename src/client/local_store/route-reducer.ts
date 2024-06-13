import { MyActions } from "shared/actions";

export interface RouterState {
	route: string;
}

const initialRouter: RouterState = {
	route: "menu",
};

export function router_reducer(state: RouterState = initialRouter, action: MyActions<RouterState>): RouterState {
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
