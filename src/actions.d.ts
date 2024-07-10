import { Action } from "@rbxts/rodux";

// Define action types
declare global {
	interface UpdateAction<T> extends Action<"UPDATE"> {
		key: keyof T;
		value: T[keyof T];
	}

	interface CreateAction<T> extends Action<"CREATE"> {
		data: Partial<T>;
	}

	interface DeleteAction<T> extends Action<"DELETE"> {
		key: keyof T;
	}

	type StoreAction<T> = UpdateAction<T> | CreateAction<T> | DeleteAction<T>;
}

export {};
