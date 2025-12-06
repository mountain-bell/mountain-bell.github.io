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
	return location === "local"
		? 0
		: (date.getTime() - localDate.getTime()) / (1000 * 60 * 60);
}
