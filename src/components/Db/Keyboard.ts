export type KeyboardLesson = string[];

export interface Keyboard {
	id: string,
	name: string,
	description: string,
	keyboards?: string[],
	lessons: KeyboardLesson[]
}

export const KeyboardCalc = {
	keyboards(keyboard: Keyboard): string[] {
		return [keyboard.id, ...(keyboard.keyboards ?? [])];
	},
};
