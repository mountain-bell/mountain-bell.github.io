import DomChainer from "../dist/index.js";

DomChainer.id("description")
	.addClass("add")
	.removeClass("remove")
	.toggleClass("toggle1 toggle2")
	.toggleClass("toggle1")
	.if(false)
	.addClass("should-not-be-added")
	.else()
	.addClass("should-be-added")
	.end()
	.addClass("final");
