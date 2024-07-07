/* client/ui/index.tsx */

import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { Router, RouterProvider } from "./router";
import Menu from "./menu";
import FriendsList from "./friends_list";
import ServerList from "./server_list";
import Lobby from "./lobby";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

const routes: Record<string, Roact.FunctionComponent> = {
	menu: Menu,
	friends: FriendsList,
	server: ServerList,
	lobby: Lobby,
};

Roact.mount(
	<RouterProvider>
		<screengui IgnoreGuiInset={true}>
			<Router routes={routes} />
		</screengui>
	</RouterProvider>,
	playerGui,
	"Router",
);
