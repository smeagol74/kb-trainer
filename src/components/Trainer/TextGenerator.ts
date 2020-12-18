import _ from 'lodash';

function rand(min: number, max: number): number {
	return Math.trunc(min + Math.random() * (max + 1 - min));
}

export type GeneratorFunc = (chars: string[], shift: number, minLen: number, maxLen: number) => string[];

const vocabulary: Dict<GeneratorFunc> = {
	random: (chars, shift, minLen: number, maxLen: number): string[] => {
		const result = [];
		const len = rand(minLen, maxLen);
		for (let i = 0; i < len; i++) {
			let char = chars[rand(0, chars.length - 1)];
			if (rand(0, 100) < (shift * 100)) {
				char = char.toUpperCase();
			}
			result.push(char);
		}
		return result;
	},
};

export const TextGenerator = {
	generate(vocab: string, chars: string[], shift: number, length: number, minWordLen: number, maxWordLen: number): string[] {
		const voc = vocabulary[vocab] ?? vocabulary.random;
		const result: string[] = [];
		for (let i = 0; i < length; i++) {
			_(voc(chars, shift, minWordLen, maxWordLen)).each(c => result.push(c));
			if (i !== length - 1) {
				result.push(' ');
			}
		}
		return result;
	},
};
