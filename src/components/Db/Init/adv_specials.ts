import type { Keyboard } from '../Keyboard';
import { Finger, sk } from '../Keyboard';

export const adv_specials: Keyboard = {
	id: 'adv_specials',
	name: 'English Special Keys',
	description: 'Training special keys like cursor, F-keys, home, ctrl and other specials',
	strokes: {
		initial: 100,
		final: 2000,
	},
	script: [
		sk(Finger.P, 'Cmd', 'Ctrl'),
		sk(Finger.P, 'Alt'),
		sk(Finger.P, 'BackSpace'),
		sk(Finger.P, 'Delete', 'Enter'),
		sk(Finger.P, 'Hyper'),
		sk(Finger.P, 'Myh'),
		sk(Finger.C, 'Esc'),
		sk(Finger.C, 'Tab'),
		sk(Finger.C, 'F1'),
		sk(Finger.C, 'F2'),
		sk(Finger.A, 'F3'),
		sk(Finger.M, 'F4'),
		sk(Finger.M, 'F5', 'F12'),
		sk(Finger.I, 'F6', 'F9'),
		sk(Finger.I, 'F7', 'F10'),
		sk(Finger.I, 'F8', 'F11'),
		sk(Finger.I, 'Home', 'PageUp'),
		sk(Finger.A, 'End', 'PageDown'),
		sk(Finger.I, 'Right', 'Up'),
		sk(Finger.M, 'Left', 'Down'),
	],
	vocabulary: 'random',
};
