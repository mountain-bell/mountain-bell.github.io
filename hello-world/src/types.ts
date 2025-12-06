export const locationList = [
	"local",
	// Asia
	"japan",
	"korea",
	"china",
	"taiwan",
	"hong_kong",
	"singapore",
	"india",
	// Europe
	"uk",
	"france",
	"germany",
	"spain",
	"italy",
	"netherlands",
	"sweden",
	// North America
	"usa",
	"canada",
	"mexico",
	// South America
	"brazil",
	"argentina",
	// Oceania
	"australia",
	"new_zealand",
	// Africa
	"south_africa",
] as const;

export type LocationType = (typeof locationList)[number];

export interface LocationDef {
	readonly greet: string;
	readonly timeZone: string | undefined;
}

export interface LocationInfo {
	readonly greet: string;
	readonly timeZone: string | undefined;
	readonly date: Date;
	readonly offsetHours: number;
}
