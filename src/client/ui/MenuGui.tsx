import Roact from "@rbxts/roact";
import { merge } from "shared/actions";
import { local_store } from "client/local_store";
import { withHooks } from "@rbxts/roact-hooked";
import { GuiState } from "client/local_store/gui-reducer";
import { RouterState } from "client/local_store/route-reducer";

interface ButtonProps {
	text: string;
	to: keyof GuiState;
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
					local_store.dispatch(merge<RouterState>("", { route: props.to }, "router"));

					print("going to: " + local_store.getState().router.route);
				},
			}}
		/>
	);
}

function MenuGui() {
	return (
		<frame
			Size={new UDim2(1 / 3, 0, 1, 0)} // 1/3 of the width, full height
			Position={new UDim2(0, 0, 0, 0)} // Positioned at the top-left corner
			BackgroundColor3={Color3.fromRGB(45, 45, 45)} // Dark background
			BackgroundTransparency={0.5} // Semi-transparent
			BorderSizePixel={0}
		>
			<uilistlayout
				Padding={new UDim(0, 20)}
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<MenuButton text="Create Lobby" to="lobby" order={1} />
			<MenuButton text="Join Server" to="server" order={2} />
			<MenuButton text="Find Friend" to="friends" order={3} />
		</frame>
	);
}

export default withHooks(MenuGui);
