/* client/ui/server_list.tsx */

import { client, requestToServer } from "client/remote";
import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import Object from "@rbxts/object-utils";
import LobbyItem from "./components/lobby_item";

const ServerList: Roact.FunctionComponent = () => {
	const [lobbies, setLobbies] = useState<Lobby[]>([]);

	useEffect(() => {
		requestToServer("GET_LOBBIES");

		const connection = client.OnClientEvent.Connect((payload: EventPayload) => {
			if (payload.event === "LOBBIES_DATA" && payload.data) {
				setLobbies(payload.data as Lobby[]);
			}
		});

		return () => connection.Disconnect();
	}, []);

	const handleLobbyClick = (lobby: Lobby) => {
		requestToServer("JOIN_LOBBY", [lobby.id]);
	};

	const lobbyItems = Object.entries(lobbies)
		.filter(([, lobby]) => lobby && lobby.players.size() > 0)
		.map(([id, lobby]) => <LobbyItem Key={id} lobby={lobby!} onClick={() => handleLobbyClick(lobby!)} />);

	return (
		<frame
			Size={new UDim2(1, 0, 1, 0)} // Full size
			BackgroundColor3={Color3.fromRGB(45, 45, 45)} // Dark background
			BackgroundTransparency={0.5} // Semi-transparent
			BorderSizePixel={0}
		>
			<uilistlayout
				Padding={new UDim(0, 10)}
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Top}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{lobbyItems}
			<textbutton
				Text="Leave"
				Size={new UDim2(0.8, 0, 0, 50)} // Width of 80%, height of 50 pixels
				BackgroundColor3={Color3.fromRGB(255, 0, 0)} // Red background
				TextColor3={Color3.fromRGB(255, 255, 255)} // White text
				Font={Enum.Font.SourceSans} // Default Roblox font
				TextSize={24}
				BorderSizePixel={0}
				Position={new UDim2(0.1, 0, 0.95, -50)} // Centered horizontally, at the bottom
				AnchorPoint={new Vector2(0, 1)} // Anchor to the bottom
				Event={{
					MouseButton1Click: () => {
						requestToServer("CHANGE_ROUTE", ["menu"]);
					},
				}}
			/>
		</frame>
	);
};

export default withHooks(ServerList);
