import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import './TrainerInstruction.scss';
import jsLogger from 'js-logger';

const log = jsLogger.get('TrainerInstruction');

export interface ITrainerInstructionProps {
	onStart: VoidCallback
}

export const TrainerInstruction: FunctionalComponent<ITrainerInstructionProps> = ({ onStart, children }) => {

	useEffect(() => {
		function _onKeydown(event: KeyboardEvent) {
			if (event.key == ' ') {
				onStart();
			} else {
				log.debug('_onKeydown:', event.key);
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
