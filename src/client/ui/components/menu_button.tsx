/* client/ui/components/menu_button.tsx */
import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { useRouter } from "../router";
import { clientStore } from "client/store";
import { Players } from "@rbxts/services";
import { serializeUserId } from "shared/utils";

interface ButtonProps {
	text: string;
	to: string;
	order: number;
	event?: string;
}

const MenuButton: Roact.FunctionComponent<ButtonProps> = withHooks((props) => {
	const { navigate } = useRouter();

	const handleClick = () => {
		if (props.event) {
			clientStore.remote(props.event, serializeUserId(Players.LocalPlayer));
			print("fired: " + props.event);
		}
		navigate(props.to);
	};

	return (
		<textbutton
			LayoutOrder={props.order}
			Size={new UDim2(0.8, 0, 0, 50)}
			BackgroundColor3={Color3.fromRGB(33, 33, 33)}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Font={Enum.Font.SourceSans}
			TextSize={24}
			Text={props.text}
			BorderSizePixel={0}
			Event={{
				MouseButton1Click: handleClick,
			}}
		/>
	);
});

export default MenuButton;
