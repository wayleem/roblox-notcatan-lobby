/* client/ui/lobby.tsx */

import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { useState, useEffect, withHooks } from "@rbxts/roact-hooked";
import { client, requestToServer, server } from "client/remote";
import PlayerList from "./components/player_list";

const Lobby: Roact.FunctionComponent = () => {
	const [lobby, setLobby] = useState<Lobby | null>(null);
	const localPlayerId = tostring(Players.LocalPlayer.UserId);

	useEffect(() => {
		// Request lobby data
		requestToServer("GET_LOBBY_DATA");

		const connection = client.OnClientEvent.Connect((payload: EventPayload) => {
			if (payload.event === "LOBBY_DATA" && payload.data) {
				setLobby(payload.data[0] as Lobby);
			}
		});

		return () => connection.Disconnect();
	}, []);

	if (!lobby) return <textlabel Text="Loading..." />;

	const isOwner = lobby.owner === localPlayerId;

	const handleStartGame = () => {
		requestToServer("START_GAME");
	};

	const handleLeaveLobby = () => {
		requestToServer("LEAVE_LOBBY");
	};

	return (
		<frame
			Key="Lobby"
			Size={new UDim2(0.3, 0, 0.5, 0)}
			Position={new UDim2(0.35, 0, 0.25, 0)}
			BackgroundColor3={Color3.fromRGB(25, 25, 25)}
			BorderSizePixel={0}
		>
			<textlabel
				Text={`Lobby ID: ${lobby.id}`}
				Size={new UDim2(1, 0, 0, 30)}
				Position={new UDim2(0, 0, 0, 0)}
				BackgroundTransparency={1}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={18}
				Font={Enum.Font.SourceSans}
			/>
			<frame
				Size={new UDim2(1, 0, 0.6, 0)} // Adjust height to fit below the text label
				Position={new UDim2(0, 0, 0.1, 0)} // Adjust position to leave space for the text label
				BackgroundTransparency={1}
			>
				<PlayerList players={lobby.players} />
			</frame>
			<frame
				Size={new UDim2(1, 0, 0.25, 0)} // Container for buttons
				Position={new UDim2(0, 0, 0.75, 0)} // Positioned below the players list
				BackgroundTransparency={1}
			>
				{isOwner && (
					<textbutton
						Size={new UDim2(0.5, 0, 1, 0)} // Half width for each button if owner
						BackgroundColor3={Color3.fromRGB(45, 45, 45)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text="Start Game"
						TextSize={18}
						Font={Enum.Font.SourceSans}
						Event={{
							MouseButton1Click: handleStartGame,
						}}
					/>
				)}
				<textbutton
					Size={new UDim2(isOwner ? 0.5 : 1, 0, 1, 0)} // Full width if not owner, half if owner
					Position={isOwner ? new UDim2(0.5, 0, 0, 0) : new UDim2(0, 0, 0, 0)}
					BackgroundColor3={Color3.fromRGB(45, 45, 45)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text="Leave Lobby"
					TextSize={18}
					Font={Enum.Font.SourceSans}
					Event={{
						MouseButton1Click: handleLeaveLobby,
					}}
				/>
			</frame>
		</frame>
	);
};

export default withHooks(Lobby);
