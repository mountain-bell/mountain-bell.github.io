export function isKebabName(name: string): boolean {
	return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name);
}

export function getTriggerNames(el: Element, prefix: string): string[] {
	const classes = (el.getAttribute("class") || "").split(/\s+/);
	const names: string[] = [];
	for (const cls of classes) {
		if (!cls.startsWith(prefix)) continue;
		const name = cls.slice(prefix.length);
		if (isKebabName(name)) names.push(name);
	}
	return names;
}

export function collectData(
	el: Element,
	name: string
): Record<string, unknown> {
	const raw = el.getAttribute(`data-${name}`);
	if (!raw) return {};
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error(`[DomTrigger] Invalid JSON in data-${name}: ${raw}`);
	}
}
