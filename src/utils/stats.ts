import _ from 'lodash';

export function sumMerge(dest: Dict<number>, src: Dict<number>) {
	_.each(src, (value, key) => {
		dest[key] = (dest[key] ?? 0) + value;
	});
}

