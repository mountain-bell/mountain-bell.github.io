import { LocationDef, LocationInfo, LocationType } from "./types";
import {
	assertLocationType,
	calculateDate,
	calculateOffsetHours,
	resolveTimeZone,
} from "./utils";

const LOCATION_DEF_MAP: Record<LocationType, LocationDef> = {
	local: {
		greet: "Hello, World!",
		timeZone: undefined,
	},
	// Asia
	japan: {
		greet: "こんにちは、世界！",
		timeZone: "Asia/Tokyo",
	},
	korea: {
		greet: "안녕하세요, 세계!",
		timeZone: "Asia/Seoul",
	},
	china: {
		greet: "你好，世界！",
		timeZone: "Asia/Shanghai",
	},
	taiwan: {
		greet: "哈囉，世界！",
		timeZone: "Asia/Taipei",
	},
	hong_kong: {
		greet: "你好，世界！",
		timeZone: "Asia/Hong_Kong",
	},
	singapore: {
		greet: "Hello, World!",
		timeZone: "Asia/Singapore",
	},
	india: {
		greet: "Hello, World!",
		timeZone: "Asia/Kolkata",
	},
	// Europe
	uk: {
		greet: "Hello, World!",
		timeZone: "Europe/London",
	},
	france: {
		greet: "Bonjour, le monde !",
		timeZone: "Europe/Paris",
	},
	germany: {
		greet: "Hallo, Welt!",
		timeZone: "Europe/Berlin",
	},
	spain: {
		greet: "¡Hola, mundo!",
		timeZone: "Europe/Madrid",
	},
	italy: {
		greet: "Ciao, mondo!",
		timeZone: "Europe/Rome",
	},
	netherlands: {
		greet: "Hallo, wereld!",
		timeZone: "Europe/Amsterdam",
	},
	sweden: {
		greet: "Hej, världen!",
		timeZone: "Europe/Stockholm",
	},
	// North America
	usa: {
		greet: "Hello, World!",
		timeZone: "America/New_York",
	},
	canada: {
		greet: "Hello, World!",
		timeZone: "America/Toronto",
	},
	mexico: {
		greet: "¡Hola, mundo!",
		timeZone: "America/Mexico_City",
	},
	// South America
	brazil: {
		greet: "Olá, mundo!",
		timeZone: "America/Sao_Paulo",
	},
	argentina: {
		greet: "¡Hola, mundo!",
		timeZone: "America/Argentina/Buenos_Aires",
	},
	// Oceania
	australia: {
		greet: "Hello, World!",
		timeZone: "Australia/Sydney",
	},
	new_zealand: {
		greet: "Hello, World!",
		timeZone: "Pacific/Auckland",
	},
	// Africa
	south_africa: {
		greet: "Hello, World!",
		timeZone: "Africa/Johannesburg",
	},
};

function getDef(location: LocationType): LocationDef {
	assertLocationType(location);
	return LOCATION_DEF_MAP[location];
}

function get(location: LocationType = "local"): LocationInfo {
	const def = getDef(location);
	const greet = def.greet;
	const timeZone = resolveTimeZone(location, def.timeZone);
	const localDate = new Date();
	const date = calculateDate(location, localDate, timeZone);
	const offsetHours = calculateOffsetHours(location, localDate, date);

	return {
		greet,
		timeZone,
		date,
		offsetHours,
	};
}

function getGreet(location: LocationType = "local") {
	return getDef(location).greet;
}

function getTimeZone(location: LocationType = "local") {
	const timeZone = getDef(location).timeZone;
	return resolveTimeZone(location, timeZone);
}

function getDate(location: LocationType = "local") {
	const timeZone = getDef(location).timeZone;
	const localDate = new Date();
	return calculateDate(location, localDate, timeZone);
}

function getOffsetHours(location: LocationType = "local") {
	return get(location).offsetHours;
}

const HelloWorld = {
	get,
	getGreet,
	getTimeZone,
	getDate,
	getOffsetHours,
} as const;

export { get, getGreet, getTimeZone, getDate, getOffsetHours };

export default HelloWorld;
