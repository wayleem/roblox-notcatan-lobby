/* client/ui/menu.tsx */

import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import MenuButton from "./components/menu_button";

const Menu: Roact.FunctionComponent = () => {
	return (
		<frame
			Key="Menu"
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
			<MenuButton text="Create Lobby" to="lobby" order={1} event="CREATE_LOBBY" />
			<MenuButton text="Join Server" to="server" order={2} />
			<MenuButton text="Find Friend" to="friends" order={3} />
		</frame>
	);
};

export default withHooks(Menu);
