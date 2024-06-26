/* client/ui/index.tsx */

import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import Router from "./router";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { local_store } from "client/local_store";
import Object from "@rbxts/object-utils";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

Roact.mount(
	<screengui IgnoreGuiInset={true}>
		<Router />
	</screengui>,
	playerGui,
	"Router",
);
