export interface Progress {
	id?: number;
	user: string;
	keyboard: string;
	date: string;
	strokes: Dict<number>;
	errors: Dict<number>;
	metronome: number;
	cpm: number;
	wpm: number;
}
