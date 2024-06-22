import Roact from "@rbxts/roact";

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
				Text={`Id: ${lobby.id} | Lobby Owner: ${lobby.owner} | Players: ${lobby.players.size()}`}
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

export default LobbyItem;
