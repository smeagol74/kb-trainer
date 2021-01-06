import type { Keyboard } from '../Keyboard';

export const specials: Keyboard = {
	id: 'specials',
	name: 'Special Keys',
	description: 'Training special keys like cursor, home, ctrl and other specials',
	lessons: [
		['Meta', 'Ctrl'],
		['Alt'],
		['BackSpace'],
		['Delete', 'Enter'],
		['Esc'],
		['Tab'],
		['Home', 'PageUp'],
		['End', 'PageDown'],
		['Right', 'Up'],
		['Left', 'Down'],
	],
};
