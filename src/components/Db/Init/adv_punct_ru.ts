import type { Keyboard } from '../Keyboard';
import { Finger, sk } from '../Keyboard';

export const adv_punct_ru: Keyboard = {
	id: 'adv_punct_ru',
	name: 'Русская пунктуация',
	description: 'Обычная русская раскладка, тренировка для десятипальцевого набора',
	strokes: {
		initial: 100,
		final: 2000,
	},
	script: [
		sk(Finger.C, '\\', '/'),
		sk(Finger.C, '.', ','),
		sk(Finger.C, '=', '+', '-', '_'),
		sk(Finger.C, '!', ')'),
		sk(Finger.A, '"', '('),
		sk(Finger.M, '№', '*'),
		sk(Finger.I, ';', '?', '%', ':'),
	],
	vocabulary: 'random',
};
