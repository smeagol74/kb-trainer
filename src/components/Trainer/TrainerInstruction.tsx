import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import './TrainerInstruction.scss';

export interface ITrainerInstructionProps {
	onStart: VoidCallback
}

export const TrainerInstruction: FunctionalComponent<ITrainerInstructionProps> = ({onStart}) => {

	useEffect(() => {
		function _onKeydown(event: KeyboardEvent) {
			onStart();
		}
		window.addEventListener('keydown', _onKeydown);
		return () => {
			window.removeEventListener('keydown', _onKeydown);
		}
	}, [onStart]);

	return <div className="TrainerInstruction">
		<div className="TrainerInstruction__button">Press space bar to start</div>
		<div className="TrainerInstruction__message">Take home row position</div>
	</div>;
};
