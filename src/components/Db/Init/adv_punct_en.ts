import type { Keyboard } from '../Keyboard';
import { Finger, sk } from '../Keyboard';

export const adv_punct_en: Keyboard = {
	id: 'adv_punct_en',
	name: 'English punctuation',
	description: 'Generic English punctuation and other shifted chars',
	strokes: {
		initial: 100,
		final: 2000,
	},
	script: [
		sk(Finger.C, ';', ':'),
		sk(Finger.C, '\'', '"'),
		sk(Finger.C, '`', '~'),
		sk(Finger.C, '\\', '|'),
		sk(Finger.C, '/', '?'),
		sk(Finger.C, ']', '}'),
		sk(Finger.A, '.', '>'),
		sk(Finger.A, '[', '{'),
		sk(Finger.M, ',', '<'),
		sk(Finger.C, '=', '+'),
		sk(Finger.C, '-', '_'),
		sk(Finger.C, '!', ')'),
		sk(Finger.A, '@', '('),
		sk(Finger.M, '#', '*'),
		sk(Finger.I, '$', '%', '&', '^'),
	],
	vocabulary: 'random',
};
