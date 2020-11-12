import { FunctionalComponent, h } from 'preact';
import type { StateUpdater } from 'preact/hooks';
import { useContext, useEffect, useState } from 'preact/hooks';
import { ITrainerLineResults, TrainerLine } from './TrainerLine';
import { TrainerInstruction } from './TrainerInstruction';
import './Trainer.scss';
import type { Keyboard } from '../Db/Keyboard';
import { Icon } from '../Icon/Icon';
import { IStudyStats, StudyCourse } from './StudyCourse';
import { UserContext } from '../../App';
import _ from 'lodash';
import { LessonLabel } from './LessonLabel';
import jsLogger from 'js-logger';
import { SummaryChart } from './SummaryChart';
import { Db } from '../Db/Db';
import type { Progress } from '../Db/Progress';
import { sumMerge } from '../../utils/stats';
import { DateTime } from 'luxon';

const log = jsLogger.get('Trainer');

export enum TrainerState {
	NEW = 'NEW',
	IN_LESSON = 'IN_LESSON',
	BETWEEN_LESSONS = 'BETWEEN_LESSONS',
	PAUSED = 'PAUSED'
}

export interface ITrainerProps {
	keyboard: Keyboard;
	state: TrainerState;
	setState: StateUpdater<TrainerState>;
}

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

export const Trainer: FunctionalComponent<ITrainerProps> = ({ state, setState, keyboard }) => {

	const [study, setStudy] = useState<StudyCourse | undefined>(undefined);

	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		if (!_.isEmpty(user) && !_.isEmpty(keyboard) && !_.isNil(setUser)) {

			_getUserKeyboardStats(user!.id, keyboard.id)
				.then(([stats, lesson]) => {
					setStudy(new StudyCourse({
						user: user!,
						keyboard: keyboard,
						stats: stats,
						onSetUser: setUser!,
						lesson: lesson,
					}));
				});
		}
	}, [user, keyboard, setStudy, setUser]);

	function _onComplete(res: ITrainerLineResults) {
		log.debug('_onComplete', res);
		Db.progress.put({
			user: user!.id,
			keyboard: keyboard.id,
			date: DateTime.local().toISO(),
			strokes: res.strokes,
			errors: res.errors,
			metronome: study!.getMetronome(),
			cpm: res.cpm,
			time: res.time,
			lesson: study!.getLessonIdx(),
		});
		setState(TrainerState.BETWEEN_LESSONS);
		study?.complete({
			strokes: res.strokes,
			errors: res.errors,
		});
	}

	function _onStart() {
		setState(TrainerState.IN_LESSON);
	}

	const sessionLabel = study && <LessonLabel {...{
		keyboard: keyboard.name,
		lesson: study.getLesson(),
		lessonNumber: study.getLessonNumber(),
	}} />;

	return <div className="Trainer">
		{study?.hasSummary() && (TrainerState.IN_LESSON !== state) && <SummaryChart {...{
			data: study?.summary(),
		}} />}
		{study && (TrainerState.IN_LESSON === state) && <TrainerLine {...{
			onComplete: _onComplete,
			text: study.getText(),
			metronome: study.getMetronome(),
		}} />}
		{TrainerState.NEW === state && <TrainerInstruction {...{
			onStart: _onStart,
		}} >
			{sessionLabel}
		</TrainerInstruction>}
		{TrainerState.BETWEEN_LESSONS === state && <TrainerInstruction {...{
			onStart: _onStart,
		}} >
			{sessionLabel}
		</TrainerInstruction>}
		{TrainerState.PAUSED === state && <TrainerInstruction {...{
			onStart: _onStart,
		}} >
			Paused. {sessionLabel}
		</TrainerInstruction>}
	</div>;
};
