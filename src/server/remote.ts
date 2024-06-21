import handleEvent from "./event_handlers";
import { server } from "./events";
import { parseEventPayload } from "shared/utils";

server.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
	const payload = parseEventPayload(args);
	print("Parsed payload received: ", payload); // Log parsed payload for debugging

	if (payload) {
		handleEvent(player, payload);
	} else {
		print("Received invalid payload: ", args[0]);
	}
});
