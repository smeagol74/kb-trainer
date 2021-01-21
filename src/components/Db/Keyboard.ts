export interface Keyboard {
	id: string,
	name: string,
	description: string,
	keyboards?: string[],
	keys: string[]
}

export const KeyboardCalc = {
	keyboards(keyboard: Keyboard): string[] {
		return [keyboard.id, ...(keyboard.keyboards ?? [])];
	},
};
