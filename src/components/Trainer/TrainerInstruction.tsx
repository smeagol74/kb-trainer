import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import './TrainerInstruction.scss';
import jsLogger from 'js-logger';
import { i18nContext } from '../../App';

const log = jsLogger.get('TrainerInstruction');

export interface ITrainerInstructionProps {
	onStart: VoidCallback,
	speedTraining: boolean
}

export const TrainerInstruction: FunctionalComponent<ITrainerInstructionProps> = ({
																																										onStart,
																																										speedTraining,
																																										children,
																																									}) => {

	const { _p } = useContext(i18nContext);

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
		<div className="TrainerInstruction__button">{_p('TrainerInstruction', 'Press space bar to start')}</div>
		<div
			className="TrainerInstruction__message">
			{speedTraining &&
			<p>{_p('TrainerInstruction', 'You are in speed training mode. Your metronome will automatically ' +
				'increase the tempo when you will be making some number of nice key presses in a row, and will decrease it ' +
				'if you will make errors. Please, do not hurry, proper keypress with right finger is better then quickly typed ' +
				'keys with a lot of errors. Speed will come to you automatically when fingers will remember proper keys positions.')}</p>}
			{!speedTraining && <p>{_p('TrainerInstruction', 'You are in familiarization with keys mode. Your ' +
				'metronome should be configured by you manually to suit your needs. Remember that proper keypress is better then ' +
				'quick. If you are training some sort of touch typing, do not forget to revert the finger to initial position ' +
				'each time after nice press. Do not hurry. This is time for your fingers to remember all proper movements from ' +
				'the base position to the proper key. This is most important in the first part of the lesson, when you are ' +
				'working with the single key only. It could be very easy to quickly type all the keys just with one finter staying ' +
				'over the proper key. This is wrong. Try to move finger to proper key from the base position, press the key, and ' +
				'return the finger back to the base position carefully and with the proper tempo. If you make a lot of mistakes, ' +
				'decrease your metronome tempo to comfortable level, so it not hurry you.')}</p>}
			<p>{_p('TrainerInstruction', 'Now make sure you have proper keyboard layout selected. ' +
				'Find required keys on keyboard and place your hands in proper position. ' +
				'Prepare to start and good luck!')}</p>
		</div>
	</div>;
};
