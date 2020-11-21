import _ from 'lodash';

export function ensureNumber(num?: number): number {
	return _.isNil(num) ? 0 : (isNaN(num) ? 0 : num);
}

export function sumMerge(dest: Dict<number>, src: Dict<number>) {
	_.each(src, (value, key) => {
		dest[key] = ensureNumber(dest[key]) + ensureNumber(value);
	});
}

