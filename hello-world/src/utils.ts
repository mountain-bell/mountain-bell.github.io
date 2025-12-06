import { locationList, LocationType } from "./types";

export function assertLocationType(location: LocationType): void {
	if (typeof location !== "string") {
		throw new TypeError(
			`Sorry, I can't tell the country from that value: ${String(location)}`
		);
	}
	if (!locationList.includes(location)) {
		throw new Error(
			`Sorry, I don't know the Hello, World! for that country: "${location}".`
		);
	}
}

export function getLocalTimeZone(): string | undefined {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function calculateDate(
	location: LocationType,
	localDate: Date,
	timeZone: string | undefined
) {
	return location === "local"
		? localDate
		: new Date(localDate.toLocaleString("en-US", { timeZone }));
}

export function calculateOffsetHours(
	location: LocationType,
	localDate: Date,
	date: Date
) {
	if (location === "local") return 0;
	const diffMs = date.getTime() - localDate.getTime();
	const diffMinutes = Math.round(diffMs / (1000 * 60));
	const offset = diffMinutes / 60;
	return Object.is(offset, -0) ? 0 : offset;
}
