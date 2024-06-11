import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { local_store } from "./local_store";
import MenuGui from "./ui/MenuGui";
import LobbyGui from "./ui/LobbyGui";
import ServerListGui from "./ui/ServerListGui";
import FriendListGui from "./ui/FriendListGui";

// Map route to component
const routes: Record<string, Roact.FunctionComponent> = {
	menu: MenuGui,
	friends: FriendListGui,
	server: ServerListGui,
	lobby: LobbyGui,
};

const RouterComponent: Roact.FunctionComponent = () => {
	const [state, setState] = useState(local_store.getState());

	useEffect(() => {
		const unsubscribe = local_store.changed.connect(() => {
			setState(local_store.getState());
		});

		return () => unsubscribe.disconnect();
	}, []);

	const RouteComponent = routes[state.router.route] || MenuGui;

	return <RouteComponent />;
};

const Router = withHooks(RouterComponent);

export default Router;
