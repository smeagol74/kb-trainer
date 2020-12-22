import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { UserKeyboardStrokes } from '../../components/Db/User';
import _ from 'lodash';
import clsx from 'clsx';
import './LessonProgress.scss';
import Logger from 'js-logger';
import type { StudyStats } from '../../components/Trainer/StudyStats';
import { keyStrokesWithErrors } from '../../components/Trainer/StudyStats';

const log = Logger.get('LessonProgress');

export interface ILessonProgress {
	className?: string;
	stats: StudyStats;
	keys: string[];
	strokes: UserKeyboardStrokes;
	extraStrokes: number;
}

export const LessonProgress: FunctionalComponent<ILessonProgress> = ({
																																			 keys,
																																			 stats,
																																			 strokes,
																																			 extraStrokes,
																																			 className,
																																		 }) => {
	const progressStrokes = _(keys).map(_.partial(keyStrokesWithErrors, stats, extraStrokes)).value();
	const progressStrokesInitial = _(progressStrokes).map(s => Math.min(strokes.initial, s)).sum() / (_.size(keys) || 1);
	const progressStrokesLesson = _(progressStrokes).map(s => Math.min(strokes.lesson, s)).sum() / (_.size(keys) || 1);
	const progressInitial = Math.min(progressStrokesInitial / strokes.initial, 1);
	const progressLesson = Math.min((progressStrokesLesson - strokes.initial) / (strokes.lesson - strokes.initial), 1);
	const progressLessonTotal = Math.min(progressStrokesLesson / strokes.lesson, 1);
	const keysStrokes = _(keys).map(k => stats.strokes[k]).sum();
	// log.debug(keys, strokes, progressStrokes);
	if (progressLessonTotal > 0 || keysStrokes > 0) {
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
	} else {
		return null;
	}
};
