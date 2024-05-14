import Roact from "@rbxts/roact";
import MenuGui from "./MenuGui";
import LobbyGui from "./LobbyGui";
import { useEffect, useState } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";

function AppGui() {
	const [currentScreen, setCurrentScreen] = useState<"menu" | "lobby">("menu");

	const switchScreen = (screen: "menu" | "lobby") => {
		setCurrentScreen(screen);
	};

	useEffect(() => {
		const screenGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;
		const handle = Roact.mount(<AppGui />, screenGui, "AppGui");

		// This function will be called when the component is unmounted
		return () => {
			Roact.unmount(handle);
		};
	}, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

	return (
		<frame Size={new UDim2(1, 0, 1, 0)}>
			{currentScreen === "menu" && <MenuGui onNavigate={() => switchScreen("lobby")} />}
			{currentScreen === "lobby" && <LobbyGui onNavigate={() => switchScreen("menu")} />}
		</frame>
	);
}

export default AppGui;
