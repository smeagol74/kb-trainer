import type { UserKeyboard } from '../Db/User';
import _ from 'lodash';
import { ensureNumber } from '../../utils/stats';
import type { KeyboardLesson } from '../Db/Keyboard';

export interface StudyStats {
	strokes: Dict<number>;
	errors: Dict<number>;
}

export function keyStrokesWithErrors(stats: StudyStats, extraStrokes: number, key: string) {
	const strokes = ensureNumber(stats.strokes[key]);
	const errors = ensureNumber(stats.errors[key]);
	const res = strokes - (errors * extraStrokes);
	return Math.max(res, 0);
}

function isComplete(stats: StudyStats, extraStrokes: number, value: number, keys: string[]): boolean {
	let result = true;
	_(keys).each((key) => {
		const isKeyComplete = keyStrokesWithErrors(stats, extraStrokes, key) >= value;
		result = result && isKeyComplete;
	});
	return result;
}

export function isInitialLessonComplete(cfg: UserKeyboard, stats: StudyStats, keys: string[]): boolean {
	return _.isEmpty(keys) || isComplete(stats, cfg.error.extraStrokes, cfg.strokes.initial, keys);
}

export function isLessonComplete(cfg: UserKeyboard, stats: StudyStats, keys: string[]): boolean {
	return isComplete(stats, cfg.error.extraStrokes, cfg.strokes.lesson, keys);
}

export function isTrainingComplete(cfg: UserKeyboard, stats: StudyStats, keys: string[]): boolean {
	return isComplete(stats, cfg.error.extraStrokes, cfg.strokes.complete, keys);
}

export function firstIncompleteLesson(cfg: UserKeyboard, stats: StudyStats, lessons: KeyboardLesson[]): number {
	let result = 0;
	let complete = true;
	_.each(lessons, (lesson) => {
		if (complete && isLessonComplete(cfg, stats, lesson)) {
			result++;
		} else {
			complete = false;
		}
	});
	return Math.min(result, lessons.length - 1);
}
