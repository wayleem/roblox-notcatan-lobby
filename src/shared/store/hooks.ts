import { useEffect, useState } from "@rbxts/roact-hooked";
import BaseStore from "./baseStore";

export function useStore<A extends SharedState, B, AB = A & B, T = AB>(
	store: BaseStore<A, B, AB>,
	selector: (state: AB) => T,
): T {
	const [selectedState, setSelectedState] = useState(() => selector(store.getState()));

	useEffect(() => {
		const unsubscribe = store.subscribe((newState) => {
			const newSelectedState = selector(newState);
			print("useStore: State updated", newSelectedState);
			setSelectedState(newSelectedState);
		});

		return unsubscribe;
	}, [store]);

	return selectedState;
}
