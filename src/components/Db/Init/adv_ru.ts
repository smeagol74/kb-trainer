import type { Keyboard } from '../Keyboard';
import { Finger, sk } from '../Keyboard';

export const adv_ru: Keyboard = {
	id: 'adv_ru',
	name: 'Русская',
	description: 'Обычная русская раскладка, тренировка для десятипальцевого набора',
	strokes: {
		initial: 100,
		final: 2000,
	},
	script: [
		sk(Finger.I, 'а', 'о', 'п', 'р'),
		sk(Finger.M, 'в', 'л'),
		sk(Finger.A, 'ы', 'д'),
		sk(Finger.C, 'ф', 'ж'),
		sk(Finger.I, 'к', 'г', 'е', 'н'),
		sk(Finger.M, 'у', 'ш'),
		sk(Finger.A, 'ц', 'щ'),
		sk(Finger.C, 'й', 'з'),
		sk(Finger.I, 'и', 'т', 'м', 'ь'),
		sk(Finger.M, 'с', 'б'),
		sk(Finger.A, 'ч', 'ю'),
		sk(Finger.C, 'я'),
		sk(Finger.C, 'ё', 'ъ'),
		sk(Finger.A, 'х'),
	],
	vocabulary: 'random',
};
