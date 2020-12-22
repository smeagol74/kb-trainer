import type { FunctionalComponent } from 'preact';
import type { UserKeyboardStrokes } from '../../components/Db/User';
import _ from 'lodash';
import { h } from 'preact';
import clsx from 'clsx';
import './KeyboardProgress.scss';
import Logger from 'js-logger';
import type { StudyStats } from '../../components/Trainer/StudyStats';
import { keyStrokesWithErrors } from '../../components/Trainer/StudyStats';

const log = Logger.get('KeyboardProgress');

export interface IKeyboardProgress {
	className?: string;
	stats: StudyStats;
	strokes: UserKeyboardStrokes;
	extraStrokes: number;
	label?: string;
}

export const KeyboardProgress: FunctionalComponent<IKeyboardProgress> = ({
																																					 stats,
																																					 strokes,
																																					 extraStrokes,
																																					 className,
																																					 label,
																																				 }) => {
	const keys = Object.keys(stats.strokes);
	const progressStrokes = _(keys)
		.map(k => Math.min(strokes.complete, keyStrokesWithErrors(stats, extraStrokes, k)))
		.sum() / (_.size(keys) || 1);
	const progressComplete = Math.min(progressStrokes / strokes.complete, 1);
	// log.debug(keys, strokes, progressStrokes);
	return <div className={clsx('KeyboardProgress', className)}>
		<div className="KeyboardProgress__cell">
			<div className="KeyboardProgress__bar">
				<div className="KeyboardProgress__bar-value"
						 style={{ width: Math.max(0, progressComplete * 100).toFixed(2) + '%' }} />
				<div className="KeyboardProgress__bar-label">{label} {(progressComplete * 100).toFixed(2)}%</div>
			</div>
		</div>
	</div>;
};
