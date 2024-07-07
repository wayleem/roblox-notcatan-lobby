import Roact from "@rbxts/roact";
import { useState, useCallback, withHooks, useContext } from "@rbxts/roact-hooked";

interface RouterContextValue {
	currentRoute: string;
	navigate: (route: string) => void;
}

const RouterContext = Roact.createContext<RouterContextValue>({
	currentRoute: "menu",
	navigate: () => {},
});

export const RouterProvider: Roact.FunctionComponent = withHooks((props) => {
	const [currentRoute, setCurrentRoute] = useState<string>("menu");
	const navigate = useCallback((route: string) => {
		setCurrentRoute(route);
	}, []);
	return <RouterContext.Provider value={{ currentRoute, navigate }}>{props[Roact.Children]}</RouterContext.Provider>;
});

export function useRouter(): RouterContextValue {
	return useContext(RouterContext);
}

interface RouterProps {
	routes: Record<string, Roact.FunctionComponent>;
}

export const Router: Roact.FunctionComponent<RouterProps> = withHooks((props) => {
	const { currentRoute } = useRouter();
	const RouteComponent = props.routes[currentRoute];
	return RouteComponent ? <RouteComponent /> : <textlabel Text={`Route not found: ${currentRoute}`} />;
});
