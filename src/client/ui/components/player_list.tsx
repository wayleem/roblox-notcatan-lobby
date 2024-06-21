import Roact from "@rbxts/roact";

interface PlayerListProps {
	players: Player[];
}

const PlayerList: Roact.FunctionComponent<PlayerListProps> = ({ players }) => {
	return (
		<scrollingframe
			Size={new UDim2(1, 0, 0.75, 0)} // Adjusted to accommodate two buttons
			CanvasSize={new UDim2(0, 0, 0, players.size() * 55)}
			BackgroundTransparency={1}
			ScrollBarThickness={6}
		>
			{players.map((player, index) => (
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
			))}
		</scrollingframe>
	);
};

export default PlayerList;
