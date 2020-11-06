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

export interface ITrainerLineResults {
	strokes: Dict<number>,
	errors: Dict<number>,
	cpm: number,
	time: number;
}

export interface ITrainerLineProps {
	onComplete: (res: ITrainerLineResults) => void,
	text: string[],
	metronome: number
}

export const TrainerLine: FunctionalComponent<ITrainerLineProps> = ({ onComplete, text, metronome }) => {

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
		const timer = setInterval(() => {
			setTime(prev => ({
				...prev,
				display: DateTime.local().diff(prev.start).toFormat('m:ss'),
			}));
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, [setTime]);

	function _onComplete(res: ITypingLineResults) {
		onComplete({
			strokes: res.strokes,
			errors: res.errors,
			cpm: _cpm(chars.complete, time.start),
			time: DateTime.local().diff(time.start).as('seconds'),
		});
	}

	return <div className="TrainerLine">
		<Metronome bpm={metronome} />
		<div className="TrainerLine__typing">
			<TypingLine {...{
				onComplete: _onComplete,
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
