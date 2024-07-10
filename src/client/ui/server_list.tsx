import Roact from "@rbxts/roact";
import { withHooks, useEffect, useState } from "@rbxts/roact-hooked";
import LobbyItem from "./components/lobby_item";
import { useRouter } from "./router";
import { clientStore } from "client/store";
import Object from "@rbxts/object-utils";
import { useStore } from "shared/store";

const ServerList: Roact.FunctionComponent = withHooks(() => {
	const lobbies = useStore(clientStore, (state) => state.lobbies);
	const [, forceUpdate] = useState({});
	const { navigate } = useRouter();

	const handleLobbyClick = (lobbyId: string) => {
		clientStore.remote("JOIN_LOBBY", lobbyId);
		navigate("lobby");
	};

	useEffect(() => {
		print("ServerList: Lobbies updated", lobbies, "Lobby count:", Object.keys(lobbies).size());
		forceUpdate({}); // Force a re-render whenever lobbies change
	}, [lobbies]);

	const lobbyItems = Object.entries(lobbies)
		.filter(([, lobby]) => lobby && lobby.players.size() > 0)
		.map(([id, lobby]) => <LobbyItem Key={id} id={id} lobby={lobby} onClick={() => handleLobbyClick(id)} />);

	return (
		<frame
			Size={new UDim2(1, 0, 1, 0)}
			BackgroundColor3={Color3.fromRGB(45, 45, 45)}
			BackgroundTransparency={0.5}
			BorderSizePixel={0}
		>
			<scrollingframe Size={new UDim2(1, 0, 0.9, 0)} BackgroundTransparency={1} BorderSizePixel={0}>
				<uilistlayout
					Padding={new UDim(0, 10)}
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{lobbyItems}
			</scrollingframe>
			{lobbyItems.size() === 0 && (
				<textlabel
					Text="No active lobbies"
					Size={new UDim2(1, 0, 0, 30)}
					Position={new UDim2(0, 0, 0.5, -15)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextSize={18}
					Font={Enum.Font.SourceSans}
				/>
			)}
			<textbutton
				Text="Back to Menu"
				Size={new UDim2(0.8, 0, 0.08, 0)}
				Position={new UDim2(0.1, 0, 0.91, 0)}
				BackgroundColor3={Color3.fromRGB(255, 0, 0)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={Enum.Font.SourceSans}
				TextSize={24}
				BorderSizePixel={0}
				Event={{
					MouseButton1Click: () => navigate("menu"),
				}}
			/>
		</frame>
	);
});

export default ServerList;
