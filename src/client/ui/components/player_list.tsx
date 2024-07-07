/* client/ui/components/player_list.tsx */

import Roact from "@rbxts/roact";

interface PlayerListProps {
	players: string[];
}

const PlayerList: Roact.FunctionComponent<PlayerListProps> = ({ players }) => {
	return (
		<scrollingframe
			Size={UDim2.fromScale(1, 1)} // Full size of the parent frame
			CanvasSize={UDim2.fromOffset(0, players.size() * 55)}
			BackgroundTransparency={1}
			ScrollBarThickness={6}
		>
			{players.map((player, index) => (
				<textlabel
					Key={player}
					Size={new UDim2(1, 0, 0, 50)}
					Position={new UDim2(0, 0, 0, index * 55)}
					BackgroundColor3={new Color3(0.129, 0.129, 0.129)}
					TextColor3={new Color3(1, 1, 1)}
					Text={player}
					TextSize={18}
					Font={Enum.Font.SourceSans}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			))}
		</scrollingframe>
	);
};

export default PlayerList;
