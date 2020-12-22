import type { Keyboard } from '../Db/Keyboard';
import type { User, UserKeyboard, UserKeyboardStrokes } from '../Db/User';
import type { Progress } from '../Db/Progress';
import _ from 'lodash';
import { ensureNumber, sumMerge } from '../../utils/stats';
import { Db } from '../Db/Db';
import { useEffect, useState } from 'preact/hooks';
import { userKeyboard } from '../../utils/user';
import type { StudyStats } from './StudyStats';
import { firstIncompleteLesson, isLessonComplete } from './StudyStats';

function _summarizeStats(progress: Progress[]): [StudyStats, number] {
	const result: StudyStats = {
		strokes: {},
		errors: {},
	};
	_(progress).each(p => {
		sumMerge(result.strokes, p.strokes);
		sumMerge(result.errors, p.errors);
	});
	return [result, _(progress).map('lesson').max() ?? 0];
}

function _getUserKeyboardStats(user: string, keyboard: string): PromiseLike<[StudyStats, number]> {
	return Db.progress.where({
		user: user,
		keyboard: keyboard,
	})
		.toArray()
		.then(_summarizeStats);
}

export function useUserKeyboardStats(user?: User, keyboard?: Keyboard): [StudyStats, number] {
	const [stats, setStats] = useState<StudyStats>({
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
					setLesson(firstIncompleteLesson(cfg, stats, keyboard.lessons));
				});
		}
	}, [user, keyboard, setStats, setLesson]);
	return [stats, lesson];
}
