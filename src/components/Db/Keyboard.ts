export type KeyboardLesson = string[];

export interface Keyboard {
	id: string,
	name: string,
	description: string,
	lessons: KeyboardLesson[],
}

