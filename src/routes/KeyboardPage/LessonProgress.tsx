import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { IStudyStats } from '../../components/Trainer/StudyCourse';
import type { UserKeyboardStrokes } from '../../components/Db/User';
import _ from 'lodash';
import clsx from 'clsx';
import './LessonProgress.scss';
import Logger from 'js-logger';

const log = Logger.get('LessonProgress');

export interface ILessonProgress {
	className?: string;
	stats: IStudyStats;
	keys: string[];
	strokes: UserKeyboardStrokes;
	extraStrokes: number;
}

export const LessonProgress: FunctionalComponent<ILessonProgress> = ({ keys, stats, strokes, extraStrokes, className }) => {
	const progressStrokes = _(keys).map(k => Math.max(stats.strokes[k] ?? 0 - (stats.errors[k] ?? 0) * extraStrokes, 0)).sum() / (_.size(keys) || 1);
	const progressInitial = Math.min(progressStrokes / strokes.initial, 1);
	const progressLesson = Math.min((progressStrokes - strokes.initial) / (strokes.lesson - strokes.initial), 1);
	const progressLessonTotal = Math.min(progressStrokes / strokes.lesson, 1);
	// log.debug(keys, strokes, progressStrokes);
	return <div className={clsx('LessonProgress', className)}>
		<div className="LessonProgress__cell">
			<div className="LessonProgress__bar--initial LessonProgress__bar">
				<div className="LessonProgress__bar-value"
						 style={{ width: Math.max(0, progressInitial * 100).toFixed(2) + '%' }} />
				{progressInitial < 1 &&
				<div className="LessonProgress__bar-label">init: {(progressInitial * 100).toFixed(2)}%</div>}
			</div>
			<div className="LessonProgress__bar--lesson LessonProgress__bar">
				<div className="LessonProgress__bar-value"
						 style={{ width: Math.max(0, progressLesson * 100).toFixed(2) + '%' }} />
				{progressLessonTotal < 1 &&
				<div className="LessonProgress__bar-label">{(progressLessonTotal * 100).toFixed(2)}%</div>}
			</div>
		</div>
	</div>;
};
