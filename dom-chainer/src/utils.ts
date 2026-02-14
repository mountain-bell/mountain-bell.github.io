export function tokenize(classNames: string[]): string[] {
	if (classNames.length === 0) return [];
	const tokens: string[] = [];
	for (const cn of classNames) {
		if (!cn) continue;
		if (cn.indexOf(" ") !== -1) {
			const parts = cn.split(/\s+/);
			for (const p of parts) {
				if (p) tokens.push(p);
			}
		} else {
			tokens.push(cn);
		}
	}
	return tokens;
}
