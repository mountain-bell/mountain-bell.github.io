class ChainElements {
	private elements: Element[];

	constructor(elements: Element[]) {
		this.elements = elements;
	}

	getElements(): Element[] {
		return this.elements;
	}

	addClass(...classNames: string[]): this {
		const tokens = classNames
			.flatMap((s) => s.split(/\s+/))
			.filter((s) => s.length > 0);
		if (tokens.length === 0) return this;
		this.elements.forEach((el) => el.classList.add(...tokens));
		return this;
	}

	removeClass(...classNames: string[]): this {
		const tokens = classNames
			.flatMap((s) => s.split(/\s+/))
			.filter((s) => s.length > 0);
		if (tokens.length === 0) return this;
		this.elements.forEach((el) => el.classList.remove(...tokens));
		return this;
	}

	toggleClass(...classNames: string[]): this {
		const tokens = classNames
			.flatMap((s) => s.split(/\s+/))
			.filter((s) => s.length > 0);
		if (tokens.length === 0) return this;
		this.elements.forEach((el) => {
			tokens.forEach((token) => el.classList.toggle(token));
		});
		return this;
	}
}

function id(id: string): ChainElements {
	const el = document.getElementById(id);
	return new ChainElements(el ? [el] : []);
}

function cls(className: string): ChainElements {
	const elements = Array.from(document.getElementsByClassName(className));
	return new ChainElements(elements);
}

function tag(tagName: string): ChainElements {
	const elements = Array.from(document.getElementsByTagName(tagName));
	return new ChainElements(elements);
}

function selOne(selector: string): ChainElements {
	const el = document.querySelector(selector);
	return new ChainElements(el ? [el] : []);
}

function selAll(selector: string): ChainElements {
	const elements = Array.from(document.querySelectorAll(selector));
	return new ChainElements(elements);
}

type ElementInput =
	| Element
	| Iterable<Element | null | undefined>
	| ArrayLike<Element | null | undefined>
	| null
	| undefined;

const isElement = (v: unknown): v is Element => v instanceof Element;

function toElements(input: ElementInput): Element[] {
	if (input == null) return [];
	if (input instanceof Element) return [input];
	return Array.from(input).filter(isElement);
}

function wrap(input: ElementInput): ChainElements {
	return new ChainElements(toElements(input));
}

const DomChainer = {
	id,
	cls,
	tag,
	selOne,
	selAll,
	wrap,
};

export { id, cls, tag, selOne, selAll, wrap };

export default DomChainer;
