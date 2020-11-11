import _ from 'lodash';

function rand(min: number, max: number): number {
	return Math.trunc(min + Math.random() * (max + 1 - min));
}

const vocabulary: Dict<(chars: string[], canCapitalize: boolean) => string[]> = {
	random: (chars, canCapitalize): string[] => {
		const result = [];
		const len = rand(2, 4);
		for(let i=0; i<len; i++) {
			let char = chars[rand(0, chars.length - 1)];
			if (canCapitalize && i===0 && rand(0, 9) > 5) {
				char = char.toUpperCase();
			}
			result.push(char);
		}
		return result;
	}
}

export const TextGenerator = {
	generate(vocab: string, chars: string[], canCapitalize: boolean, length: number): string[] {
		const voc = vocabulary[vocab] ?? vocabulary.random;
		const result: string[] = [];
		for(let i=0; i<length; i++) {
			_(voc(chars, canCapitalize)).each(c => result.push(c));
			if(i !== length-1) {
				result.push(' ');
			}
		}
		return result;
	}
}
