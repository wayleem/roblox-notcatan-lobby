/* client/ui/server_list.tsx */
import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import LobbyItem from "./components/lobby_item";
import { useRouter } from "./router";
import { clientStore } from "client/store";
import Object from "@rbxts/object-utils";

const ServerList: Roact.FunctionComponent = withHooks(() => {
	const [lobbies, setLobbies] = useState<Record<string, Lobby>>(clientStore.getState().lobbies);
	const { navigate } = useRouter();

	useEffect(() => {
		const currentLobbies = clientStore.getState().lobbies;
		setLobbies(currentLobbies);
	}, []);

	const handleLobbyClick = (lobby: Lobby) => {
		clientStore.sendToServer("JOIN_LOBBY", [lobby.id]);
		navigate("lobby"); // Navigate to the lobby page after joining
	};

	const lobbyItems = Object.entries(lobbies)
		.filter(([, lobby]) => lobby && lobby.players.size() > 0)
		.map(([id, lobby]) => <LobbyItem Key={id} lobby={lobby} onClick={() => handleLobbyClick(lobby)} />);

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