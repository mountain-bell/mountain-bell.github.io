const locationList = [
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
];

console.log("---- test: default call ----");
console.log("get:", HelloWorld.get());
console.log("greet:", HelloWorld.getGreet());
console.log("timeZone:", HelloWorld.getTimeZone());
console.log("date:", HelloWorld.getDate());
console.log("offsetHours:", HelloWorld.getOffsetHours());

console.log("---- test: call with argument ----");
for (const loc of locationList) {
	console.log(`\n[${loc}]`);
	console.log("get:", HelloWorld.get(loc));
	console.log("greet:", HelloWorld.getGreet(loc));
	console.log("timeZone:", HelloWorld.getTimeZone(loc));
	console.log("date:", HelloWorld.getDate(loc));
	console.log("offsetHours:", HelloWorld.getOffsetHours(loc));
}
