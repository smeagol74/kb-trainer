import _ from 'lodash';

export function parentWithAttr(attr: string, element?: HTMLElement | null): HTMLElement | undefined {
	if (element) {
		const data = element?.parentElement?.getAttribute(attr);
		if (_.isEmpty(data)) {
			return parentWithAttr(attr, element?.parentElement);
		} else {
			return element?.parentElement!;
		}
	} else {
		return undefined;
	}
}

export function parentWithClass(clazz: string, element?: HTMLElement | null): HTMLElement | undefined {
	if (element) {
		if (element?.parentElement?.classList.contains(clazz) ?? false) {
			return element?.parentElement!;
		} else {
			return parentWithClass(clazz, element?.parentElement);
		}
	} else {
		return undefined;
	}
}

export function parseIntDef(value?: string | number, def?: number): number | undefined {
	let result = def;
	if (value) {
		result = parseInt(value.toString(), 0);
		if (isNaN(result)) {
			result = def;
		}
	}
	return result;
}

export function inputNumberValue(el?: HTMLInputElement, def?: number): number | undefined {
	let result = def;
	if (el) {
		result = parseIntDef(el.valueAsNumber, def);
		if (!_.isNil(result)) {
			const min = parseIntDef(el.min);
			const max = parseIntDef(el.max);
			if (!_.isNil(min)) {
				result = Math.max(result, min);
			}
			if (!_.isNil(max)) {
				result = Math.min(result, max);
			}
		}
	}
	return result;
}
