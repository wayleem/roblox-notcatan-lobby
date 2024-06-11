import Roact from "@rbxts/roact";
import { useEffect } from "@rbxts/roact-hooked";
import { local_store } from "./local_store";
import { RouterState } from "./local_store/route-reducer";
import { merge } from "shared/actions";

// Define your route components
const Home = () => <textlabel Text="Home Page" Size={new UDim2(1, 0, 1, 0)} />;
const About = () => <textlabel Text="About Page" Size={new UDim2(1, 0, 1, 0)} />;
const Contact = () => <textlabel Text="Contact Page" Size={new UDim2(1, 0, 1, 0)} />;

// Map route to component
const routes: Record<string, Roact.FunctionComponent> = {
	home: Home,
	about: About,
	contact: Contact,
};

const Router: Roact.FunctionComponent = () => {
	const [state, setState] = Roact.useState(store.getState());

	useEffect(() => {
		const unsubscribe = store.changed.connect(() => {
			setState(store.getState());
		});

		return () => unsubscribe.disconnect();
	}, []);

	const RouteComponent = routes[state.route] || Home;

	return <RouteComponent />;
};

// Utility functions to change routes
const navigate = (route: string) => {
	store.dispatch(merge<RouterState>("", { route }, "router"));
};

export { Router, navigate };
