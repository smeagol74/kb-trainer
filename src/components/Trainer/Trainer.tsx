import { FunctionalComponent, h, Key } from 'preact';
import type { StateUpdater } from 'preact/hooks';
import { TrainerLine } from './TrainerLine';
import { TrainerInstruction } from './TrainerInstruction';
import './Trainer.scss';
import type { ITypingLineResults } from '../TypingLine/TypingLine';
import type { Keyboard } from '../Db/Keyboard';
import { Icon } from '../Icon/Icon';

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

export const Trainer: FunctionalComponent<ITrainerProps> = ({ state, setState, keyboard}) => {

	const text = ['H', 'e', 'l', 'l', 'o', 'F1', ' ', 'W', 'o', 'r', 'l', 'Enter', 'd', '!', ' ', 'Ctrl+a', ' ', 'Ctrl+Cmd+b'];

	function _onComplete(res: ITypingLineResults) {
		console.log(res);
		setState(TrainerState.BETWEEN_LESSONS);
	}

	function _onStart() {
		setState(TrainerState.IN_LESSON);
	}

	return <div className="Trainer">
		{TrainerState.IN_LESSON === state && <TrainerLine {...{
			onComplete: _onComplete,
			text: text,
		}} />}
		{TrainerState.NEW === state && <TrainerInstruction {...{
			onStart: _onStart,
		}} >
			<Icon img="rocket-19" size="lg"/> New training session. <Icon img="keyboard-4" size="lg"/> {keyboard.name} – <Icon img="education-1" size="lg"/> Lesson 1.
		</TrainerInstruction>}
		{TrainerState.BETWEEN_LESSONS === state && <TrainerInstruction {...{
			onStart: _onStart,
		}} >
			<Icon img="keyboard-4" size="lg"/> {keyboard.name} – <Icon img="education-1" size="lg"/> Lesson 2.
		</TrainerInstruction>}
		{TrainerState.PAUSED === state && <TrainerInstruction {...{
			onStart: _onStart,
		}} >
			Paused. <Icon img="keyboard-4" size="lg"/> {keyboard.name} – <Icon img="education-1" size="lg"/> Lesson 3.
		</TrainerInstruction>}
	</div>;
};
