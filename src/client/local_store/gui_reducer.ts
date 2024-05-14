import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import MenuGui from "client/ui/MenuGui";
import { MyActions } from "shared/actions";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
const screenGui = playerGui.WaitForChild("ScreenGui") as ScreenGui;

export function gui_reducer(
	state: Roact.Tree = Roact.mount(MenuGui(), screenGui),
	action: MyActions<Roact.Tree>,
): Roact.Tree {
	if (action.target === "gui")
		switch (action.type) {
			case "CREATE":
				Roact.unmount(state);
				state = action.data;
				return state;
		}
	return state;
}
