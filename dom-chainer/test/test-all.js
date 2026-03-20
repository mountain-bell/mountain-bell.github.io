/* eslint-disable no-console */
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
	.setStyle("color", "red")
	.tap((el) => {
		const element = el;
		console.log("setStyle:", element.style.color);
	})
	.removeStyle("color")
	.tap((el) => {
		const element = el;
		console.log("removeStyle:", element.style.color);
	})
	.setAttr("data-a", "1")
	.tap((el) => {
		const element = el;
		console.log("setAttr:", element.dataset.a);
	})
	.removeAttr("data-a")
	.tap((el) => {
		const element = el;
		console.log("removeAttr:", element.dataset.a);
	})
	.html("<span>New HTML</span>")
	.tap((el) => console.log("html:", el.innerHTML))
	.text("New Text")
	.tap((el) => console.log("text:", el.textContent))
	.append(" [", "Appended", "]")
	.prepend("[", "Prepended", "] ")
	.tap((el) => console.log("append prepend:", el.textContent))
	.before("[", "Before", "]")
	.after("[", "After", "]")
	.empty();

DomChainer.id("input")
	.val("New Value")
	.tap((el) => {
		const element = el;
		console.log("val:", element.value);
	})
	.remove();
