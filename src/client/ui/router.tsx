import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { local_store } from "client/local_store";
import Menu from "./menu";
import FriendsList from "./friends_list";
import ServerList from "./server_list";
import Lobby from "./lobby";

const routes: Record<string, Roact.FunctionComponent> = {
	menu: Menu,
	friends: FriendsList,
	server: ServerList,
	lobby: Lobby,
};

const Router: Roact.FunctionComponent = () => {
	const [state, setState] = useState(local_store.getState());
	useEffect(() => {
		const unsubscribe = local_store.changed.connect(() => {
			setState(local_store.getState());
		});

		return () => unsubscribe.disconnect();
	}, []);
	const RouteComponent = routes[state.router.route] || Menu;
	return <RouteComponent />;
};

export default withHooks(Router);
