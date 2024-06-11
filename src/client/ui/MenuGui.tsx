import Roact from "@rbxts/roact";
import { create, merge, update } from "shared/actions";
import { local_store } from "client/local_store";
import { gui } from "shared/types";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { GuiState } from "client/local_store/gui_reducer";

interface ButtonProps {
	text: string;
	navigate: keyof GuiState;
	order: number;
	event?: RemoteEvent;
}

function MenuButton(props: ButtonProps) {
	return (
		<textbutton
			LayoutOrder={props.order}
			Size={new UDim2(0.8, 0, 0, 50)} // Width of 80%, height of 50 pixels
			BackgroundColor3={Color3.fromRGB(33, 33, 33)} // Dark gray
			TextColor3={Color3.fromRGB(255, 255, 255)} // White text
			Font={Enum.Font.SourceSans} // Default Roblox font
			TextSize={24}
			Text={props.text}
			BorderSizePixel={0}
			Event={{
				MouseButton1Click: () => {
					if (props.event) props.event.FireServer();
					// Create the new state based on the navigate prop
					const newState: Partial<GuiState> = { [props.navigate]: true };

					// Dispatch merge action with the new state
					local_store.dispatch(merge<GuiState>("", newState, "gui"));

					print("going to: " + local_store.getState().gui);
				},
			}}
		/>
	);
}

function MenuGui() {
	const [guiState, setGuiState] = useState(local_store.getState().gui.menu);

	useEffect(() => {
		// Subscribe to store updates
		const unsubscribe = local_store.subscribe(() => {
			const newGuiState = local_store.getState().gui.menu;
			setGuiState(newGuiState);
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		// This function runs on mount and whenever guiState changes
		print("Visibility changed:", guiState);
	}, [guiState]);
	return (
		<frame
			Size={new UDim2(1 / 3, 0, 1, 0)} // 1/3 of the width, full height
			Position={new UDim2(0, 0, 0, 0)} // Positioned at the top-left corner
			BackgroundColor3={Color3.fromRGB(45, 45, 45)} // Dark background
			BackgroundTransparency={0.5} // Semi-transparent
			BorderSizePixel={0}
			Visible={guiState} // Toggle visibility based on local_gui state
		>
			<uilistlayout
				Padding={new UDim(0, 20)}
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<MenuButton text="Create Lobby" navigate="lobby" order={1} />
			<MenuButton text="Join Server" navigate="server" order={2} />
			<MenuButton text="Find Friend" navigate="friends" order={3} />
		</frame>
	);
}

export default withHooks(MenuGui);
