import type { Keyboard } from '../Keyboard';

export const punct_ru: Keyboard = {
	id: 'punct_ru',
	name: 'Русская пунктуация',
	description: 'Обычная русская раскладка, тренировка для десятипальцевого набора',
	lessons: [
		['\\', '/'],
		['.', ','],
		['=', '+', '-', '_'],
		['!', ')'],
		['"', '('],
		['№', '*'],
		[';', '?', '%', ':'],
	],
};
