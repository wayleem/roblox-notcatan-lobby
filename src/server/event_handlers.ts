/* server/event_handlers.ts */

import { TeleportService, HttpService } from "@rbxts/services";
import { store } from "./store";
import { MyActions, create, del, merge } from "shared/actions";
import { clients } from "./events";
import Object from "@rbxts/object-utils";
import { initLobbyState } from "shared/store";

const LobbyManager = (() => {
	function updateClientState(player: Player, localLobby: Lobby | typeof initLobbyState, route: Route) {
		clients.FireClient(player, merge("", localLobby, "localLobby"));
		clients.FireClient(player, merge("", { route }, "router"));
	}

	function broadcastLobbyUpdate(action: MyActions<Lobby>) {
		store.dispatch(action);
		clients.FireAllClients(action);
	}

	function updateLobbyMembers(lobby: Lobby) {
		lobby.players.forEach((player) => {
			updateClientState(player, lobby, "lobby");
		});
	}

	function removePlayerFromLobby(lobby: Lobby, player: Player): Lobby {
		return {
			...lobby,
			players: lobby.players.filter((p) => p !== player),
		};
	}

	function transferOwnership(lobby: Lobby): Lobby {
		const newOwner = lobby.players[0].UserId;
		return {
			...lobby,
			owner: tostring(newOwner),
		};
	}

	return {
		createLobby(player: Player): void {
			const lobbyId = HttpService.GenerateGUID(false);
			const lobby: Lobby = {
				id: lobbyId,
				owner: tostring(player.UserId),
				players: [player],
			};
			const action = create(lobbyId, lobby, "lobbies");
			broadcastLobbyUpdate(action);
			updateClientState(player, lobby, "lobby");
			print(`New lobby created with ID: ${lobbyId}`);
		},

		joinLobby(player: Player, lobbyId: string): void {
			const lobbies = store.getState().lobbies as Record<string, Lobby>;
			const lobby = lobbies[lobbyId];
			if (lobby) {
				const updatedLobby: Lobby = {
					...lobby,
					players: [...lobby.players, player],
				};
				const action = merge<Lobby>(lobbyId, updatedLobby, "lobbies");

				broadcastLobbyUpdate(action);
				updateLobbyMembers(updatedLobby);
				print(`Player joined lobby: ${lobbyId}`);
			} else {
				print(`Lobby not found: ${lobbyId}`);
			}
		},

		leaveLobby(player: Player): void {
			const lobbies = store.getState().lobbies as Record<string, Lobby>;
			const lobbyEntry = Object.entries(lobbies).find(([_, lobby]) => lobby.players.includes(player));
			if (!lobbyEntry) return;
			const [lobbyId, lobby] = lobbyEntry;
			const updatedLobby = removePlayerFromLobby(lobby, player);
			let action;
			if (updatedLobby.players.size() === 0) {
				action = del(lobbyId, "lobbies");
				print(`Deleting lobby: ${lobbyId}`);
				broadcastLobbyUpdate(action);
				clients.FireClient(player, merge("current", initLobbyState, "localLobby"));
				updateClientState(player, initLobbyState, "menu");
			} else if (lobby.owner === tostring(player.UserId)) {
				const newLobby = transferOwnership(updatedLobby);
				action = merge(lobbyId, newLobby, "lobbies");
				broadcastLobbyUpdate(action);
				updateLobbyMembers(newLobby);
				const newOwner = newLobby.players.find((p) => tostring(p.UserId) === newLobby.owner);
				if (newOwner) {
					updateClientState(newOwner, newLobby, "lobby");
				}
				updateClientState(player, initLobbyState, "menu");
				print(`Ownership transferred in lobby: ${lobbyId}`);
			} else {
				action = merge(lobbyId, updatedLobby, "lobbies");
				broadcastLobbyUpdate(action);
				updateLobbyMembers(updatedLobby);
				updateClientState(player, initLobbyState, "menu");
				print(`Player left lobby: ${lobbyId}`);
			}
		},

		startGame(player: Player): void {
			const placeId = 17410242416;
			const lobbies = store.getState().lobbies as Record<string, Lobby>;
			const playerLobby = Object.entries(lobbies).find(([_, lobby]) => lobby.owner === tostring(player.UserId));
			if (playerLobby) {
				const [lobbyId, lobby] = playerLobby;
				lobby.players.forEach((player) => TeleportService.Teleport(placeId, player));
				const action = del(lobbyId, "lobbies");
				broadcastLobbyUpdate(action);
				print(`Starting game for lobby: ${lobbyId}`);
			}
		},
	};
})();

export default function handleEvent(player: Player, payload: EventPayload): void {
	const { event, data } = payload;
	print(`Event received from client: ${event}`);
	print("Data received: ", data);
	switch (event) {
		case "CREATE_LOBBY":
			LobbyManager.createLobby(player);
			break;
		case "JOIN_LOBBY":
			if (data && data[0]) {
				LobbyManager.joinLobby(player, data[0] as string);
			}
			break;
		case "LEAVE_LOBBY":
			LobbyManager.leaveLobby(player);
			break;
		case "START_GAME":
			LobbyManager.startGame(player);
			break;
		default:
			print(`Unknown event: ${event}`);
			break;
	}
}
