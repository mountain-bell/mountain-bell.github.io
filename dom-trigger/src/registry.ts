import { DomTriggerHandler } from "./types";

const map = new Map<string, DomTriggerHandler>();

export const Registry = {
	set(name: string, handler: DomTriggerHandler) {
		map.set(name, handler);
	},
	get(name: string): DomTriggerHandler | undefined {
		return map.get(name);
	},
	delete(name: string) {
		map.delete(name);
	},
	clear() {
		map.clear();
	},
};
