/* client/ui/lobby.tsx */
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { useState, useEffect, withHooks } from "@rbxts/roact-hooked";
import PlayerList from "./components/player_list";
import { useRouter } from "./router";
import Object from "@rbxts/object-utils";
import { clientStore } from "client/store";

const Lobby: Roact.FunctionComponent = withHooks(() => {
	const [lobby, setLobby] = useState<Lobby | undefined>(undefined);
	const localPlayerId = tostring(Players.LocalPlayer.UserId);
	const { navigate } = useRouter();

	useEffect(() => {
		const currentLobby = Object.values(clientStore.getState().lobbies).find((l) =>
			l.players.includes(localPlayerId),
		);
		setLobby(currentLobby || undefined);
	}, [localPlayerId]);

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
