import type { Keyboard } from '../Keyboard';
import { Finger, sk } from '../Keyboard';

export const adv_en: Keyboard = {
	id: 'adv_en',
	name: 'English QWERTY',
	description: 'Generic English layout for touch typing.',
	strokes: {
		initial: 100,
		final: 2000,
	},
	script: [
		sk(Finger.I, 'f', 'j', 'g', 'h'),
		sk(Finger.M, 'd', 'k'),
		sk(Finger.A, 's', 'l'),
		sk(Finger.C, 'a'),
		sk(Finger.I, 't', 'y'),
		sk(Finger.I, 'r', 'u'),
		sk(Finger.I, 'b', 'n'),
		sk(Finger.I, 'v', 'm'),
		sk(Finger.M, 'e', 'i'),
		sk(Finger.M, 'c'),
		sk(Finger.A, 'w', 'o'),
		sk(Finger.A, 'x'),
		sk(Finger.C, 'q', 'p'),
		sk(Finger.C, 'z'),
		sk(Finger.C, 'Shift'),
	],
	vocabulary: 'random',
};
