import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import Router from "./router";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

Roact.mount(
	<screengui IgnoreGuiInset={true}>
		<Router />
	</screengui>,
	playerGui,
	"Router",
);

Players.LocalPlayer.CharacterAdded.Connect(() => {
	Roact.mount(
		<screengui IgnoreGuiInset={true}>
			<Router />
		</screengui>,
		playerGui,
		"Router",
	);
});
