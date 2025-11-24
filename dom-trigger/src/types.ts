export type DomTriggerData = Record<string, unknown>;

export interface DomTriggerContext {
	name: string;
	event?: Event;
}

export interface DomTriggerArgs {
	el?: Element;
	data?: DomTriggerData;
	ctx?: DomTriggerContext;
}

export type DomTriggerHandler = (args: DomTriggerArgs) => void | Promise<void>;
