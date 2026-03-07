/* eslint-disable no-console */
import DomChainer from "../dist/index.js";

DomChainer.id("description")
	.addClass("add1")
	.addClass("add2 add3")
	.addClass("add4", "add5")
	.addClass("add6", "add7 add8")
	.tap((el) => console.log(el.classList.value))
	.removeClass("add1")
	.removeClass("add2 add3")
	.removeClass("add4", "add5")
	.removeClass("add6", "add7 add8")
	.tap((el) => console.log(el.classList.value))
	.toggleClass("toggle1")
	.toggleClass("toggle2")
	.toggleClass("toggle3")
	.toggleClass("toggle4")
	.toggleClass("toggle1")
	.toggleClass("toggle3", false)
	.toggleClass("toggle4", true)
	.tap((el) => console.log(el.classList.value))
	.removeClass("toggle2", "toggle4")
	.if(false)
	.addClass("should-not-be-added")
	.else()
	.addClass("should-be-added")
	.end()
	.addClass("final")
	.tap((el) => console.log(el.classList.value))
	.tap(() => console.log("---- Attribute Tests ----"))
	.setAttr("data-a", "1")
	.tap((el) => {
		const element = el as HTMLElement;
		console.log("setAttr:", element.dataset.a);
	})
	.removeAttr("data-a")
	.tap((el) => {
		const element = el as HTMLElement;
		console.log("removeAttr:", element.dataset.a);
	})
	.toggleAttr("data-b", "2") // add
	.tap((el) => {
		const element = el as HTMLElement;
		console.log("toggleAttr on:", element.dataset.b);
	})
	.toggleAttr("data-b", "2") // remove
	.tap((el) => {
		const element = el as HTMLElement;
		console.log("toggleAttr off:", element.dataset.b);
	})
	.setAttr("data-c", "existing") // ensure it exists
	.tap((el) => {
		const element = el as HTMLElement;
		console.log("toggleAttr force on (before):", element.dataset.c);
	})
	.toggleAttr("data-c", "3", true) // force on (should overwrite)
	.tap((el) => {
		const element = el as HTMLElement;
		console.log("toggleAttr force on (after):", element.dataset.c);
	})
	.toggleAttr("data-c", "3", false) // force off
	.tap((el) => {
		const element = el as HTMLElement;
		console.log("toggleAttr force off:", element.dataset.c);
	});
