import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import './TrainerInstruction.scss';

export interface ITrainerInstructionProps {
	onStart: VoidCallback
}

export const TrainerInstruction: FunctionalComponent<ITrainerInstructionProps> = ({ onStart, children }) => {

	useEffect(() => {
		function _onKeydown(event: KeyboardEvent) {
			if (event.key == ' ') {
				onStart();
			} else {
				console.log(event.key);
			}
		}

		window.addEventListener('keydown', _onKeydown);
		return () => {
			window.removeEventListener('keydown', _onKeydown);
		};
	}, [onStart]);

	return <div className="TrainerInstruction">
		{children && <div className="TrainerInstruction__title">{children}</div>}
		<div className="TrainerInstruction__button">Press space bar to start</div>
		<div className="TrainerInstruction__message">Take home row position</div>
	</div>;
};
