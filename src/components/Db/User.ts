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
		/**
		 * Number of strokes without errors after metronome automatically changed
		 */
		hotStreak: number;
		/**
		 * Number of strokes without errors to increase tempo
		 */
		speedUp: number;
		/**
		 * Tempo amount to increase
		 */
		inc: number;
		/**
		 * Tempo amount to decrease
		 */
		dec: number;
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
		/**
		 * Number of strokes without errors
		 */
		hotStreak: number;
		/**
		 * Best hotStreak ever
		 */
		bestHotStreak: number;
	}
}

export const DEFAULT_USER_KEYBOARD: UserKeyboard = {
	metronome: {
		tempo: 30,
		volume: 1,
		hotStreak: 0,
		speedUp: 200,
		inc: 5,
		dec: 5,
	},
	lesson: 0,
	strokes: {
		initial: 100,
		lesson: 200,
		complete: 2000,
	},
	textGenerator: {
		minWordLen: 2,
		maxWordLen: 4,
		words: 30,
	},
	error: {
		extraStrokes: 20,
		hotStreak: 0,
		bestHotStreak: 0,
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
