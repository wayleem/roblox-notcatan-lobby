function log(level: string, ...s: unknown[]) {
	print("(", level, ")", ...s);
}

export function debug(...s: unknown[]) {
	log("debug", ...s);
}

export function warn(...s: unknown[]) {
	log("warn", ...s);
}

export function err(...s: unknown[]) {
	log("err", ...s);
}
