import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { create } from "shared/actions";
import { Lobby } from "shared/types";
import MenuGui from "./MenuGui";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
const screenGui = playerGui.WaitForChild("ScreenGui") as ScreenGui;

interface LobbyProps {
	lobby: Lobby;
	onNavigate: () => void;
}

function LobbyGui(props: LobbyProps) {
	const isOwner = props.lobby.owner.UserId === Players.LocalPlayer.UserId;
	const players = props.lobby.players.map((player, index) => (
		<textlabel
			Key={tostring(player.UserId)}
			Size={new UDim2(1, 0, 0, 50)}
			Position={new UDim2(0, 0, 0, index * 55)}
			BackgroundColor3={Color3.fromRGB(33, 33, 33)}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={player.Name}
			TextSize={18}
			Font={Enum.Font.SourceSans}
			TextXAlignment={Enum.TextXAlignment.Left}
		/>
	));

	return (
		<frame
			Size={new UDim2(0.3, 0, 0.5, 0)}
			Position={new UDim2(0.35, 0, 0.25, 0)}
			BackgroundColor3={Color3.fromRGB(25, 25, 25)}
			BorderSizePixel={0}
		>
			<scrollingframe
				Size={new UDim2(1, 0, 0.75, 0)} // Adjusted to accommodate two buttons
				CanvasSize={new UDim2(0, 0, 0, props.lobby.players.size() * 55)}
				BackgroundTransparency={1}
				ScrollBarThickness={6}
			>
				{players}
			</scrollingframe>
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
							MouseButton1Click: () => {},
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
						MouseButton1Click: () => create<Roact.Tree>("", Roact.mount(MenuGui(), screenGui), "gui"),
					}}
				/>
			</frame>
		</frame>
	);
}

export default LobbyGui;
