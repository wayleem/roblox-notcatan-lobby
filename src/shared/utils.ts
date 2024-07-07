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
