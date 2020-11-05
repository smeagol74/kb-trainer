export enum Finger {
	/**
	 * Pulgar = Thumb = Большой
	 */
	P = 'P',
	/**
	 * Indice = Index = Указательный
	 */
	I = 'I',
	/**
	 * Medio = Middle = Средний
	 */
	M = 'M',
	/**
	 * Anular = Ring = Безымянный
	 */
	A = 'A',
	/**
	 * Chico = Pinky = Мизинец
	 */
	C = 'C'
}

export interface KeyboardStrokes {
	initial: number;
	final: number;
}

export interface KeyboardLesson {
	keys: string[],
	finger: Finger
}

export function sk(finger: Finger, ...keys: string[]): KeyboardLesson {
	return {
		keys,
		finger
	}
}

export interface Keyboard {
	id: string,
	name: string,
	description: string,
	strokes: KeyboardStrokes,
	script: KeyboardLesson[],
	vocabulary: string
}

export const FCaption = {
	[Finger.P]: 'Thumb',
	[Finger.I]: 'Index',
	[Finger.M]: 'Middle',
	[Finger.A]: 'Ring',
	[Finger.C]: 'Pinky',
};
