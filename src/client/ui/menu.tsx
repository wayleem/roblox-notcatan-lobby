import { Players, ReplicatedStorage } from "@rbxts/services";

const createLobbyEvent = ReplicatedStorage.WaitForChild("CreateLobbyEvent") as RemoteEvent;

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
const screenGui = playerGui.WaitForChild("ScreenGui") as ScreenGui;

const menu = screenGui.WaitForChild("Menu") as Frame;

const createLobbyButton = menu.WaitForChild("CreateLobby") as TextButton;

menu.Visible = true;

createLobbyButton.MouseButton1Click.Connect(() => {
	createLobbyEvent.FireServer();
});
