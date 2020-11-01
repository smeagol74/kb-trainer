import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { ITypingLineResults, TypingLine } from '../TypingLine/TypingLine';
import './TrainerLine.scss';
import { Metronome } from '../Metronome/Metronome';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'preact/hooks';

function _cpm(chars: number, time: DateTime) {
	const minutes = DateTime.local().diff(time).as('minutes');
	return Math.round(chars / minutes);
}

export interface ITrainerLineProps {
	onComplete: (res: ITypingLineResults) => void,
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
	message: string;
	bpm: number;
}

export const TrainerLine: FunctionalComponent<ITrainerLineProps> = ({ onComplete, text }) => {

	const [errors, setErrors] = useState({
		total: 0,
		perc: 0,
	});
	const [time, setTime] = useState({
		start: DateTime.local(),
		display: '',
	});
	const [chars, setChars] = useState({
		total: text.length + 1,
		complete: 0,
	});
	const [state, setState] = useState({
		message: '',
		bpm: 100,
	});

	const _onType = useCallback((complete: number) => {
		setChars(prev => ({
			...prev,
			complete: complete,
		}));
	}, [setChars]);

	const _onError = useCallback((errors: number) => {
		setErrors(prev => ({
			...prev,
			total: errors,
			perc: Math.round(chars.complete > 0 ? errors * 100 / chars.complete : 0),
		}));
	}, [chars.complete, setErrors]);

	useEffect(() => {
		const timer = setInterval(()=>{
			setTime(prev => ({
				...prev,
				display: DateTime.local().diff(prev.start).toFormat('m:ss')
			}))
		}, 1000);
		return ()=>{
			clearInterval(timer);
		}
	}, [setTime]);

	return <div className="TrainerLine">
		<Metronome bpm={state.bpm} />
		<div className="TrainerLine__typing">
			<TypingLine {...{
				onComplete: onComplete,
				onType: _onType,
				onError: _onError,
				text,
			}} />
		</div>
		<div className="TrainerLine__info">
			<div className="TrainerLine__info-item">Errors: {errors.total} ({errors.perc}%)</div>
			<div className="TrainerLine__info-item">Cpm: {_cpm(chars.complete, time.start)}</div>
			<div className="TrainerLine__info-center">{state.message}</div>
			<div className="TrainerLine__info-item">Time: {time.display}</div>
			<div className="TrainerLine__info-item">Chars: {chars.complete} / {chars.total}</div>
		</div>
	</div>;
};
