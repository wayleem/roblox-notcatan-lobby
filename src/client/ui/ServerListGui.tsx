import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { local_store } from "../local_store";
import { Lobby } from "shared/types";
import { ArrayT } from "shared/types";
import Object from "@rbxts/object-utils";
import { merge } from "shared/actions";
import { RouterState } from "client/local_store/route-reducer";
import { ReplicatedStorage, Players } from "@rbxts/services";

interface LobbyProps {
	lobby: Lobby;
	onClick: () => void;
}

const LobbyItem: Roact.FunctionComponent<LobbyProps> = ({ lobby, onClick }) => {
	return (
		<textbutton
			Size={new UDim2(1, 0, 0, 50)} // Full width, height of 50 pixels
			BackgroundColor3={Color3.fromRGB(33, 33, 33)} // Dark gray
			BorderSizePixel={0}
			Event={{
				MouseButton1Click: onClick,
			}}
		>
			<textlabel
				Text={`Lobby Owner: ${lobby.owner} | Players: ${lobby.players.size()}`}
				Size={new UDim2(1, -10, 1, -10)} // Slight padding
				Position={new UDim2(0, 5, 0, 5)}
				BackgroundTransparency={1} // Transparent background
				TextColor3={Color3.fromRGB(255, 255, 255)} // White text
				Font={Enum.Font.SourceSans} // Default Roblox font
				TextSize={24}
			/>
		</textbutton>
	);
};

const joinLobbyEvent = ReplicatedStorage.WaitForChild("JoinLobbyEvent") as RemoteEvent;
const leaveLobbyEvent = ReplicatedStorage.WaitForChild("LeaveLobbyEvent") as RemoteEvent;

const ServerList: Roact.FunctionComponent = () => {
	const [lobbies, setLobbies] = useState<ArrayT<Lobby>>(local_store.getState().lobbies);

	useEffect(() => {
		const unsubscribe = local_store.changed.connect(() => {
			setLobbies(local_store.getState().lobbies);
		});

		return () => unsubscribe.disconnect();
	}, []);

	const handleLobbyClick = (lobby: Lobby) => {
		joinLobbyEvent.FireServer(lobby.owner); // Send the lobby owner (or another identifier)
		local_store.dispatch(merge("current", lobby, "localLobby"));
		local_store.dispatch(merge<RouterState>("", { route: "lobby" }, "router"));
	};

	const lobbyItems = Object.entries(lobbies)
		.filter(([, lobby]) => lobby !== undefined && lobby!.players.size() > 0) // Filter lobbies with 0 players
		.map(([owner, lobby]) => <LobbyItem Key={owner} lobby={lobby!} onClick={() => handleLobbyClick(lobby!)} />); // Use Key instead of key

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
						leaveLobbyEvent.FireServer();
						local_store.dispatch(merge<RouterState>("", { route: "menu" }, "router"));
					},
				}}
			/>
		</frame>
	);
};

export default withHooks(ServerList);
