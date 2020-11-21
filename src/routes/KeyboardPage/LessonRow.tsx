import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import _ from 'lodash';
import type { IStudyStats } from '../../components/Trainer/StudyCourse';
import { LessonProgress } from './LessonProgress';
import type { UserKeyboardStrokes } from '../../components/Db/User';
import './LessonRow.scss';
import clsx from 'clsx';

export interface ILessonRowProps {
	lesson: number;
	current: number;
	keys: string[];
	stats: IStudyStats;
	strokes: UserKeyboardStrokes;
	extraStrokes: number;
}

export const LessonRow: FunctionalComponent<ILessonRowProps> = ({ lesson, keys, stats, current, strokes, extraStrokes }) => {
	return <div
		className={clsx('LessonRow', { 'LessonRow--active': lesson === current, 'LessonRow--future': lesson > current })}>
		<div className="LessonRow__label">
			Lesson {lesson + 1}:
		</div>
		<div className="LessonRow__keys">
			{_.map(keys, (k, kidx) => <kbd key={`${lesson}-${kidx}`}>{k}</kbd>)}
		</div>
		<LessonProgress {...{
			className: 'LessonRow__progress',
			keys,
			stats,
			strokes,
			extraStrokes,
		}} />
	</div>;
};
