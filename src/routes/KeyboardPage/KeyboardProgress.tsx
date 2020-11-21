import type { FunctionalComponent } from 'preact';
import type { IStudyStats } from '../../components/Trainer/StudyCourse';
import type { UserKeyboardStrokes } from '../../components/Db/User';
import _ from 'lodash';
import { h } from 'preact';
import clsx from 'clsx';
import './KeyboardProgress.scss';
import Logger from 'js-logger';

const log = Logger.get('KeyboardProgress');

export interface IKeyboardProgress {
	className?: string;
	stats: IStudyStats;
	strokes: UserKeyboardStrokes;
	extraStrokes: number;
}

export const KeyboardProgress: FunctionalComponent<IKeyboardProgress> = ({ stats, strokes, extraStrokes, className }) => {
	const keys = Object.keys(stats.strokes);
	const progressStrokes = _(keys).map(k => Math.max(stats.strokes[k] ?? 0 - (stats.errors[k] ?? 0) * extraStrokes, 0)).sum() / (_.size(keys) || 1);
	const progressComplete = Math.min(progressStrokes / strokes.complete, 1);
	// log.debug(keys, strokes, progressStrokes);
	if (progressStrokes > 0) {
		return <div className={clsx('KeyboardProgress', className)}>
			<div className="KeyboardProgress__cell">
				<div className="KeyboardProgress__bar">
					<div className="KeyboardProgress__bar-value"
							 style={{ width: Math.max(0, progressComplete * 100).toFixed(2) + '%' }} />
					<div className="KeyboardProgress__bar-label">{(progressComplete * 100).toFixed(2)}%</div>
				</div>
			</div>
		</div>;
	} else {
		return <div className={clsx('KeyboardProgress', className)} />;
	}
};
