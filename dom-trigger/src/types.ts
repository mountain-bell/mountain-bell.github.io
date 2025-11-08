export type DomTriggerData = Record<string, unknown>;

export interface DomTriggerContext {
	name: string;
	event?: Event;
}

export type DomTriggerHandler = (
	el: Element | null,
	data: DomTriggerData,
	ctx: DomTriggerContext
) => void | Promise<void>;
