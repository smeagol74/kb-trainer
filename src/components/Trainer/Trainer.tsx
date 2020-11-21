import { FunctionalComponent, h } from 'preact';
import type { StateUpdater } from 'preact/hooks';
import { useContext, useEffect, useState } from 'preact/hooks';
import { ITrainerLineResults, TrainerLine } from './TrainerLine';
import { TrainerInstruction } from './TrainerInstruction';
import './Trainer.scss';
import type { Keyboard } from '../Db/Keyboard';
import { StudyCourse } from './StudyCourse';
import { UserContext } from '../../App';
import _ from 'lodash';
import { LessonLabel } from './LessonLabel';
import jsLogger from 'js-logger';
import { SummaryChart } from './SummaryChart';
import { Db } from '../Db/Db';
import { DateTime } from 'luxon';
import { useUserKeyboardStats } from './useUserKeyboardStats';
import { LessonProgress } from '../../routes/KeyboardPage/LessonProgress';
import { KeyboardProgress } from '../../routes/KeyboardPage/KeyboardProgress';

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

export const Trainer: FunctionalComponent<ITrainerProps> = ({ state, setState, keyboard }) => {

	const [study, setStudy] = useState<StudyCourse | undefined>(undefined);

	const { user, setUser } = useContext(UserContext);

	const [stats, lesson] = useUserKeyboardStats(user, keyboard);

	useEffect(() => {
		if (!_.isEmpty(user) && !_.isEmpty(keyboard) && !_.isNil(setUser)) {
			setStudy(new StudyCourse({
				user: user!,
				keyboard: keyboard,
				stats: stats,
				onSetUser: setUser!,
				lesson: lesson,
			}));
		}
	}, [user, keyboard, setStudy, setUser, stats, lesson]);

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
			metronomeVolume: study.getMetronomeVolume(),
		}} />}
		{TrainerState.NEW === state && <TrainerInstruction {...{
			onStart: _onStart,
		}} >
			<div>{sessionLabel}</div>
			{study && <LessonProgress {...{
				className: 'Trainer__progress',
				stats: study.getStats(),
				strokes: study.getConfig().strokes,
				extraStrokes: study.getConfig().error.extraStrokes,
				keys: study.getLesson(),
			}} />}
			{study && <KeyboardProgress {...{
				className: 'Trainer__progress',
				stats: study.getStats(),
				strokes: study.getConfig().strokes,
				extraStrokes: study.getConfig().error.extraStrokes,
			}} />}
		</TrainerInstruction>}
		{TrainerState.BETWEEN_LESSONS === state && <TrainerInstruction {...{
			onStart: _onStart,
		}} >
			<div>{sessionLabel}</div>
			{study && <LessonProgress {...{
				className: 'Trainer__progress',
				stats: study.getStats(),
				strokes: study.getConfig().strokes,
				extraStrokes: study.getConfig().error.extraStrokes,
				keys: study.getLesson(),

			}} />}
			{study && <KeyboardProgress {...{
				className: 'Trainer__progress',
				stats: study.getStats(),
				strokes: study.getConfig().strokes,
				extraStrokes: study.getConfig().error.extraStrokes,
			}} />}
		</TrainerInstruction>}
		{TrainerState.PAUSED === state && <TrainerInstruction {...{
			onStart: _onStart,
		}} >
			<div>Paused. {sessionLabel}</div>
			{study && <LessonProgress {...{
				className: 'Trainer__progress',
				stats: study.getStats(),
				strokes: study.getConfig().strokes,
				extraStrokes: study.getConfig().error.extraStrokes,
				keys: study.getLesson(),

			}} />}
			{study && <KeyboardProgress {...{
				className: 'Trainer__progress',
				stats: study.getStats(),
				strokes: study.getConfig().strokes,
				extraStrokes: study.getConfig().error.extraStrokes,
			}} />}
		</TrainerInstruction>}
	</div>;
};
