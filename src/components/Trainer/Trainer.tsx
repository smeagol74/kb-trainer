import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { TrainerLine } from './TrainerLine';
import { TrainerInstruction } from './TrainerInstruction';
import './Trainer.scss';
import type { ITypingLineResults } from '../TypingLine/TypingLine';

export interface ITrainerProps {
}

export const Trainer: FunctionalComponent<ITrainerProps> = () => {
	const [started, setStarted] = useState<boolean>(false);

	const text = ['H',	'e', 'l', 'l', 'o' , 'F1',' ', 'W', 'o', 'r', 'l', 'Enter', 'd', '!', ' ', 'Ctrl+a', ' ', 'Ctrl+Cmd+b',];

	function _onComplete(res: ITypingLineResults) {
		console.log(res);
		setStarted(false);
	}

	function _onStart() {
		setStarted(true);
	}

	return <div className="Trainer">
		{started && <TrainerLine {...{
			onComplete: _onComplete,
			text: text
		}} />}
		{!started && <TrainerInstruction {...{
			onStart: _onStart,
		}} />}
	</div>;
};
