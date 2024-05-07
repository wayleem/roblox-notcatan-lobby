export function serialize_userid(userId: number): string {
	return `player:${userId}`;
}

export function deserialize_userid(userId: string): number {
	const parts = userId.split(":");
	return tonumber(parts[1], 10) as number;
}

export function serialize_lobby(userId: number): string {
	const time = DateTime.now();
	const formattedTime = time.FormatUniversalTime("YYYY-MM-DD HH:MM:SS", "en-us");
	return `owner:${userId}:${formattedTime}`;
}
