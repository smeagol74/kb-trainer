import { FunctionalComponent, h, Key } from 'preact';
import type { StateUpdater } from 'preact/hooks';
import { TrainerLine } from './TrainerLine';
import { TrainerInstruction } from './TrainerInstruction';
import './Trainer.scss';
import type { ITypingLineResults } from '../TypingLine/TypingLine';
import type { Keyboard } from '../Db/Keyboard';
import { Icon } from '../Icon/Icon';
import { StudyCourse } from './StudyCourse';
import { useContext, useEffect, useState } from 'preact/hooks';
import { UserContext } from '../../App';
import _ from 'lodash';
import { LessonLabel } from './LessonLabel';
import jsLogger from 'js-logger';
import { SummaryChart } from './SummaryChart';

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

	useEffect(() => {
		if (!_.isEmpty(user) && !_.isEmpty(keyboard) && !_.isNil(setUser)) {
			setStudy(new StudyCourse({
				user: user!,
				keyboard: keyboard,
				onSetUser: setUser!,
			}));
		}
	}, [user, keyboard, setStudy, setUser]);

	function _onComplete(res: ITypingLineResults) {
		log.debug('_onComplete', res);
		setState(TrainerState.BETWEEN_LESSONS);
		study?.complete(res);
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
			<Icon img="rocket-19" size="lg" /> New training session. {sessionLabel}
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
