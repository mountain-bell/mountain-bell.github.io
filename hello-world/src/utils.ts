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
	if (location === "local") return localDate;
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
	const parts = formatter.formatToParts(localDate);
	const get = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((p) => p.type === type)?.value ?? "00";
	const iso = `${get("year")}-${get("month")}-${get("day")}T${get(
		"hour"
	)}:${get("minute")}:${get("second")}`;
	return new Date(iso);
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
