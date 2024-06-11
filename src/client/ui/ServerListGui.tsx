import Roact from "@rbxts/roact";

interface Props {
	isVisible: boolean; // This prop will be passed from where you mount this component
}
function ServerListGui(props: Props) {
	return <frame />;
}

export default ServerListGui;
