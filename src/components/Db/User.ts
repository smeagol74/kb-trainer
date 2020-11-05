export interface UserKeyboard {
	metronome: number;
	lesson: number;
}

export interface User {
	id: string;
	name: string;
	keyboards: Dict<UserKeyboard>;
}
