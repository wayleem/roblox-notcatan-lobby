import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import FriendListGui from "client/ui/FriendListGui";
import LobbyGui from "client/ui/LobbyGui";
import MenuGui from "client/ui/MenuGui";
import ServerListGui from "client/ui/ServerListGui";
import { MyActions } from "shared/actions";
import { Screen } from "shared/types";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
const screenGui = playerGui.WaitForChild("ScreenGui") as ScreenGui;

export function gui_reducer(
  state: Screen = { gui: "menu", tree: Roact.mount(MenuGui(), screenGui), lobby: { owner: "", players: [] } },
  action: MyActions<Screen>,
): Screen {
  if (action.target === "gui")
    switch (action.type) {
      case "CREATE":
        if (state.tree)
          Roact.unmount(state.tree)
        state = action.data
        switch (state.gui) {
          case "menu":
            state.tree = Roact.mount(MenuGui(), screenGui)
          case "lobby":
            state.tree = Roact.mount(LobbyGui(), screenGui)
          case "servers":
            state.tree = Roact.mount(ServerListGui(), screenGui)
          case "friends":
            state.tree = Roact.mount(FriendListGui(), screenGui)
        }
        return state
      case "UPDATE_KEY":
        if (action.key in state) {
          return { ...state, [action.key]: action.value };
        }
        return state;

    }
  return state;
}
