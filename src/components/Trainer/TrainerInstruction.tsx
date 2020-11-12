import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import './TrainerInstruction.scss';
import jsLogger from 'js-logger';
import { i18nContext } from '../../App';

const log = jsLogger.get('TrainerInstruction');

export interface ITrainerInstructionProps {
	onStart: VoidCallback
}

export const TrainerInstruction: FunctionalComponent<ITrainerInstructionProps> = ({ onStart, children }) => {

	const { __ } = useContext(i18nContext);

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
		<div className="TrainerInstruction__button">{__('Press space bar to start')}</div>
		<div
			className="TrainerInstruction__message">{__('Make sure you have proper keyboard layout selected. ' +
			'Find required keys on keyboard and place your hands in proper position. ' +
			'Prepare to start.')}</div>
	</div>;
};
