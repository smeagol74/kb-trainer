import type { Keyboard } from '../Db/Keyboard';
import type { User, UserKeyboard, UserKeyboardStrokes } from '../Db/User';
import type { Progress } from '../Db/Progress';
import type { IStudyStats } from './StudyCourse';
import _ from 'lodash';
import { ensureNumber, sumMerge } from '../../utils/stats';
import { Db } from '../Db/Db';
import { useEffect, useState } from 'preact/hooks';
import { userKeyboard } from '../../utils/user';

function _summarizeStats(progress: Progress[]): [IStudyStats, number] {
	const result: IStudyStats = {
		strokes: {},
		errors: {},
	};
	_(progress).each(p => {
		sumMerge(result.strokes, p.strokes);
		sumMerge(result.errors, p.errors);
	});
	return [result, _(progress).map('lesson').max() ?? 0];
}

function _getUserKeyboardStats(user: string, keyboard: string): PromiseLike<[IStudyStats, number]> {
	return Db.progress.where({
		user: user,
		keyboard: keyboard,
	})
		.toArray()
		.then(_summarizeStats);
}

function _isLessonComplete(cfg: UserKeyboard, stats: IStudyStats, keys: string[]): boolean {
	let result = true;
	_(keys).each((key) => {
		const errorlessStrokes = ensureNumber(stats.strokes[key]) - ensureNumber(stats.errors[key]) * cfg.error.extraStrokes;
		const isKeyComplete = errorlessStrokes >= cfg.strokes.lesson;
		result = result && isKeyComplete;
	});
	return result;
}

function _nextLesson(cfg: UserKeyboard, stats: IStudyStats, keys: string[], lesson: number, maxLesson: number): number {
	let result = lesson;
	if (_isLessonComplete(cfg, stats, keys)) {
		result = result + 1;
	}
	return Math.min(result, maxLesson);
}

export function useUserKeyboardStats(user?: User, keyboard?: Keyboard): [IStudyStats, number] {
	const [stats, setStats] = useState<IStudyStats>({
		errors: {},
		strokes: {},
	});
	const [lesson, setLesson] = useState<number>(0);

	useEffect(() => {
		if (user && keyboard) {
			_getUserKeyboardStats(user!.id, keyboard!.id)
				.then(([stats, lesson]) => {
					setStats(stats);
					const cfg = userKeyboard(user, keyboard);
					setLesson(_nextLesson(cfg, stats, keyboard.lessons[lesson], lesson, keyboard.lessons.length - 1));
				});
		}
	}, [user, keyboard, setStats, setLesson]);
	return [stats, lesson];
}
