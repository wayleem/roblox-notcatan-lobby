export default function getLobbyId(payload: unknown): string | undefined {
	if (typeIs(payload, "string")) {
		return payload;
	} else if (typeIs(payload, "table")) {
		if ("data" in payload && typeIs(payload.data, "string")) {
			return payload.data;
		} else if ("lobbyId" in payload && typeIs(payload.lobbyId, "string")) {
			return payload.lobbyId;
		}
	}
	return undefined;
}
