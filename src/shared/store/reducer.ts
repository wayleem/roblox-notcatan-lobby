import { createReducer } from "@rbxts/rodux";

export default function createGenericReducer<T>() {
	return createReducer<T, StoreAction<T>>({} as T, {
		UPDATE: (state, action) => ({
			...state,
			[action.key]: action.value,
		}),
		CREATE: (state, action) => ({
			...state,
			...action.data,
		}),
		DELETE: (state, action) => {
			const newState = { ...state };
			delete newState[action.key];
			return newState;
		},
	});
}
