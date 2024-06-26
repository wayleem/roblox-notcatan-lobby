/* shared/actions.ts */

type Action_Create<T> = { id: string; data: T; type: "CREATE"; target: string };
type Action_Merge<T> = { id: string; data: Partial<T>; type: "MERGE"; target: string };
type Action_Update<T> = {
	id: string;
	key: keyof T;
	value: unknown;
	type: "UPDATE_KEY";
	target: string;
};
type Action_Del = { id: string; type: "DEL"; target: string };
type Action_Flush<T> = { id: string; state: ArrayT<T>; type: "PING"; target: string };

export type MyActions<T> = Action_Create<T> | Action_Merge<T> | Action_Update<T> | Action_Del | Action_Flush<T>;

export function create<T>(id: string, data: T, target: string): Action_Create<T> {
	return {
		type: "CREATE",
		id,
		data,
		target,
	};
}

export function merge<T>(id: string, data: Partial<T>, target: string): Action_Merge<T> {
	return {
		type: "MERGE",
		id,
		data,
		target,
	};
}

export function update<T>(id: string, key: keyof T, value: unknown, target: string): Action_Update<T> {
	return {
		type: "UPDATE_KEY",
		id,
		key,
		value,
		target,
	};
}

export function del(id: string, target: string): Action_Del {
	return {
		type: "DEL",
		id,
		target,
	};
}

export function flush<T>(id: string, state: ArrayT<T>, target: string): Action_Flush<T> {
	return {
		type: "PING",
		id,
		state,
		target,
	};
}
