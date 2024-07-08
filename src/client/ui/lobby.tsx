/* client/ui/lobby.tsx */
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { useState, useEffect, withHooks } from "@rbxts/roact-hooked";
import PlayerList from "./components/player_list";
import { useRouter } from "./router";
import { clientStore } from "client/store";
import Object from "@rbxts/object-utils";
import { serializeUserId } from "shared/utils";
import { useStore } from "shared/store";

interface LobbyWithId extends Lobby {
	id: string;
}

const Lobby: Roact.FunctionComponent = withHooks(() => {
	const localPlayerId = serializeUserId(Players.LocalPlayer);
	const { navigate } = useRouter();

	// Use the custom hook to subscribe to the lobbies state
	const lobbies = useStore(clientStore, (state) => state.lobbies);

	const [lobby, setLobby] = useState<LobbyWithId | undefined>(undefined);

	useEffect(() => {
		const [id, currentLobby] = Object.entries(lobbies).find(([, l]) => l.players.includes(localPlayerId)) || [
			undefined,
			undefined,
		];
		if (id && currentLobby) {
			setLobby({ ...currentLobby, id });
		} else {
			setLobby(undefined);
		}
	}, [lobbies, localPlayerId]);

	if (!lobby) return <textlabel Text="Loading..." />;

	const isOwner = lobby.owner === localPlayerId;

	const handleStartGame = () => {
		clientStore.sendToServer("START_GAME", lobby.id);
	};

	const handleLeaveLobby = () => {
		clientStore.sendToServer("LEAVE_LOBBY", lobby.id);
		navigate("menu");
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
			<frame Size={new UDim2(1, 0, 0.6, 0)} Position={new UDim2(0, 0, 0.1, 0)} BackgroundTransparency={1}>
				<PlayerList players={lobby.players} />
			</frame>
			<frame Size={new UDim2(1, 0, 0.25, 0)} Position={new UDim2(0, 0, 0.75, 0)} BackgroundTransparency={1}>
				{isOwner && (
					<textbutton
						Key="StartButton"
						Size={new UDim2(0.5, 0, 1, 0)}
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
					Key="LeaveButton"
					Size={new UDim2(isOwner ? 0.5 : 1, 0, 1, 0)}
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
});

export default Lobby;
