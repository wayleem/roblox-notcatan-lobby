import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { create } from "shared/actions";
import LobbyGui from "./LobbyGui";
import ServerListGui from "./ServerListGui";
import FriendListGui from "./FriendListGui";
import { local_store } from "client/local_store";
import { Lobby, Screen, gui } from "shared/types";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
const screenGui = playerGui.WaitForChild("ScreenGui") as ScreenGui;

const lobbies = local_store.getState().lobbies;

interface ButtonProps {
  text: string;
  navigate: gui;
  order: number;
  event?: RemoteEvent
}

// In MenuGui.tsx when the "Create Lobby" button is clicked

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
          if (props.event) props.event.FireServer()
          create<Screen>("", { gui: props.navigate }, "gui")
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
      <MenuButton
        text="Create Lobby"
        navigate="lobby"
        order={1}
      />
      <MenuButton text="Join Server" navigate="servers" order={2} />
      <MenuButton text="Find Friend" navigate="friends" order={3} />
    </frame>
  );
}

export default MenuGui;
