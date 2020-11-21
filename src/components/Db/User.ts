export interface UserKeyboardStrokes {
	/**
	 * Number of errorless strokes of each key required to append keys from previous lessons
	 */
	initial: number;
	/**
	 * Number of errorless strokes of each key required to move to next lesson
	 */
	lesson: number;
	/**
	 * Number of errorless strokes of each key to consider the keyboard trained
	 */
	complete: number;
}

/**
 * User specific keyboard configuration and progress
 */
export interface UserKeyboard {
	/**
	 * Metronome configuration
	 */
	metronome: {
		/**
		 * Last metronome tempo
		 */
		tempo: number;
		/**
		 * Just sound volume
		 */
		volume: number;
	}
	/**
	 * Last trained lesson
	 */
	lesson: number;
	/**
	 * Keyboard training configuration
	 */
	strokes: UserKeyboardStrokes;
	/**
	 * Lesson text generator configuration
	 */
	textGenerator: {
		/**
		 * Minimal word length in chars
		 */
		minWordLen: number;
		/**
		 * Maximum word length in chars
		 */
		maxWordLen: number;
		/**
		 * Number of worlds in one training line
		 */
		words: number;
	},
	/**
	 * Errors handling configuration
	 */
	error: {
		/**
		 * Number of extra strokes required to be performed as penalty for error
		 */
		extraStrokes: number;
	}
}

export const DEFAULT_USER_KEYBOARD: UserKeyboard = {
	metronome: {
		tempo: 30,
		volume: 1,
	},
	lesson: 0,
	strokes: {
		initial: 10,
		lesson: 20,
		complete: 200,
	},
	textGenerator: {
		minWordLen: 2,
		maxWordLen: 4,
		words: 30,
	},
	error: {
		extraStrokes: 10,
	},
};

/**
 * User record
 */
export interface User {
	id: string;
	name: string;
	keyboards: Dict<UserKeyboard>;
}
