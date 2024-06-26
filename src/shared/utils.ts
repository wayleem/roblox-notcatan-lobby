/* shared/utils.ts */

export function serializeUserId(userId: number): string {
	return `player:${userId}`;
}

export function deserializeUserId(userId: string): number {
	const parts = userId.split(":");
	return tonumber(parts[1], 10) as number;
}

export function serializeLobby(userId: number): string {
	const time = DateTime.now();
	const formattedTime = time.FormatUniversalTime("YYYY-MM-DD HH:MM:SS", "en-us");
	return `owner:${userId}:${formattedTime}`;
}

export function parseEventPayload(args: unknown[]): EventPayload | undefined {
	if (args.size() > 0) {
		const payload = args[0];
		if (type(payload) === "table") {
			const payloadObj = payload as { [key: string]: unknown };

			const event = payloadObj["event"];
			const data = payloadObj["data"];

			if (typeIs(event, "string")) {
				if (data === undefined) {
					return { event: event as string };
				} else if (type(data) === "table") {
					return { event: event as string, data: data as unknown[] };
				} else {
					// Handle case where data is not a table
					return { event: event as string, data: [data] };
				}
			}
		}
	}
	return undefined;
}
