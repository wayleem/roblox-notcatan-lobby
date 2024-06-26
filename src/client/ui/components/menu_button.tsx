/* client/ui/components/menu_button.tsx */

import Roact from "@rbxts/roact";
import { merge } from "shared/actions";
import { local_store } from "client/local_store";
import { Players } from "@rbxts/services";
import { server } from "client/remote";
import Object from "@rbxts/object-utils";

interface ButtonProps {
	text: string;
	to: Route;
	order: number;
	event?: string;
}

const MenuButton: Roact.FunctionComponent<ButtonProps> = ({ text, to, order, event }) => {
	const handleClick = () => {
		if (event) {
			server.FireServer({ event });
			print("fired: " + event);
		}
		local_store.dispatch(merge<RouterState>("", { route: to }, "router"));
		print("lobbies: " + Object.entries(local_store.getState().lobbies));
	};

	return (
		<textbutton
			LayoutOrder={order}
			Size={new UDim2(0.8, 0, 0, 50)}
			BackgroundColor3={Color3.fromRGB(33, 33, 33)}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Font={Enum.Font.SourceSans}
			TextSize={24}
			Text={text}
			BorderSizePixel={0}
			Event={{
				MouseButton1Click: handleClick,
			}}
		/>
	);
};

export default MenuButton;
