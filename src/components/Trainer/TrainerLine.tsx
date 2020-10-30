import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { TypingLine } from '../TypingLine/TypingLine';
import './TrainerLine.scss';
import { Metronome } from '../Metronome/Metronome';
import { DateTime } from 'luxon';
import { useState } from 'preact/hooks';

function _cpm(chars: number, time: DateTime) {
	const minutes = time.diffNow().as('minutes');
	return chars / minutes;
}

export interface ITrainerLineProps {
	onComplete: VoidCallback,
	text: string[]
}

export interface ITrainerLineState {
	errors: {
		total: number,
		perc: number
	},
	start: DateTime,
	time: string,
	chars: {
		total: number,
		complete: number
	},
	message: string
}

export const TrainerLine: FunctionalComponent<ITrainerLineProps> = ({ onComplete, text }) => {
	const [state, setState] = useState<ITrainerLineState>({
		errors: {
			total: 0,
			perc: 0,
		},
		start: DateTime.local(),
		time: '',
		chars: {
			total: text.length + 1,
			complete: 0,
		},
		message: '',
	});
	return <div className="TrainerLine">
		<Metronome bpm={100} />
		<div className="TrainerLine__typing">
			<TypingLine {...{
				onComplete: onComplete,
				text,
			}} />
		</div>
		<div className="TrainerLine__info">
			<div className="TrainerLine__info-item">Errors: {state.errors.total} ({state.errors.perc}%)</div>
			<div className="TrainerLine__info-item">Cpm: {_cpm(state.chars.complete, state.start)}</div>
			<div className="TrainerLine__info-center">{state.message}</div>
			<div className="TrainerLine__info-item">Time: {state.time}</div>
			<div className="TrainerLine__info-item">Chars: {state.chars.complete} / {state.chars.total}</div>
		</div>
	</div>;
};
