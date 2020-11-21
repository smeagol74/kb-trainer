import type { Keyboard } from '../Db/Keyboard';
import type { User } from '../Db/User';
import type { Progress } from '../Db/Progress';
import type { IStudyStats } from './StudyCourse';
import _ from 'lodash';
import { sumMerge } from '../../utils/stats';
import { Db } from '../Db/Db';
import { useEffect, useState } from 'preact/hooks';

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
					setLesson(lesson);
				});
		}
	}, [user, keyboard, setStats, setLesson]);
	return [stats, lesson];
}
