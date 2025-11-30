export type DomTriggerData = Record<string, unknown>;

export interface DomTriggerContext {
	name: string;
	event?: Event;
}

export interface DomTriggerArgs<TData extends DomTriggerData = DomTriggerData> {
	el?: Element;
	data?: TData;
	ctx?: DomTriggerContext;
}

export type DomTriggerHandler<TData extends DomTriggerData = DomTriggerData> = (
	args: DomTriggerArgs<TData>
) => void | Promise<void>;
