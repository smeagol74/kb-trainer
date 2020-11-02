import type { Keyboard } from '../Keyboard';
import { Finger, sk } from '../Keyboard';

export const adv_numbers: Keyboard = {
	id: 'adv_numbers',
	name: 'Numbers 1-0',
	description: 'Top line numbers',
	strokes: {
		initial: 100,
		final: 2000
	},
	script: [
		sk(Finger.I, '4', '7'),
		sk(Finger.I, '5', '6'),
		sk(Finger.M, '3', '8'),
		sk(Finger.A, '2', '9'),
		sk(Finger.C, '1', '0')
	],
	vocabulary: 'random'
}
