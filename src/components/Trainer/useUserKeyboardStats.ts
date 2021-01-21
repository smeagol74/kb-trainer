import type { Keyboard } from '../Db/Keyboard';
import { KeyboardCalc } from '../Db/Keyboard';
import type { User } from '../Db/User';
import type { Progress } from '../Db/Progress';
import _ from 'lodash';
import { sumMerge } from '../../utils/stats';
import { Db } from '../Db/Db';
import { useEffect, useState } from 'preact/hooks';
import { userKeyboard } from '../../utils/user';
import type { StudyStats } from './StudyStats';
import { firstIncompleteLesson } from './StudyStats';

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

function _getUserKeyboardStats(user: string, keyboards: string[]): PromiseLike<[StudyStats, number]> {
	const promises = _.map(keyboards, keyboard => Db.progress.where({
		user: user,
		keyboard: keyboard,
	})
		.toArray());
	return Promise.all(promises)
		.then(progresses => _.flatten(progresses))
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
			_getUserKeyboardStats(user!.id, KeyboardCalc.keyboards(keyboard!))
				.then(([stats]) => {
					setStats(stats);
					const cfg = userKeyboard(user, keyboard);
					setLesson(firstIncompleteLesson(cfg, stats, keyboard.keys));
				});
		}
	}, [user, keyboard, setStats, setLesson]);
	return [stats, lesson];
}
