import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { ITypingLineResults, TypingLine } from '../TypingLine/TypingLine';
import './TrainerLine.scss';
import { Metronome } from '../Metronome/Metronome';
import { DateTime } from 'luxon';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { i18nContext } from '../../App';
import _ from 'lodash';

function _cpm(chars: number, time: DateTime) {
	const minutes = DateTime.local().diff(time).as('minutes');
	return Math.round(chars / minutes);
}

export interface ITrainerLineResults {
	strokes: Dict<number>;
	errors: Dict<number>;
	cpm: number;
	time: number;
	hotStreak: number;
}

export interface ITrainerLineProps {
	onComplete: (res: ITrainerLineResults) => void;
	text: string[];
	metronome: number;
	metronomeVolume: number;
}

export const TrainerLine: FunctionalComponent<ITrainerLineProps> = ({
																																			onComplete,
																																			text,
																																			metronome,
																																			metronomeVolume,
																																		}) => {

	const { _p } = useContext(i18nContext);
	const [errors, setErrors] = useState({
		total: 0,
		perc: 0,
	});
	const [time, setTime] = useState({
		start: undefined,
		display: '',
	} as {start?: DateTime, display: string});
	const [chars, setChars] = useState({
		total: text.length + 1,
		complete: 0,
	});

	const _onType = useCallback((complete: number) => {
		setChars(prev => ({
			...prev,
			complete: complete,
		}));
		setTime(prev => {
			const res = {
				...prev
			};
			if (_.isNil(res.start)) {
				res.start = DateTime.local()
			}
			return res;
		})
	}, [setChars, setTime]);

	const _onError = useCallback((errors: number) => {
		setErrors(prev => ({
			...prev,
			total: errors,
		}));
	}, [setErrors]);

	useEffect(() => {
		setErrors(prev => ({
			...prev,
			perc: Math.round(chars.complete > 0 ? prev.total * 100 / chars.complete : 0),
		}));
	}, [chars.complete, setErrors]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(prev => ({
				...prev,
				display: DateTime.local().diff(prev.start ?? DateTime.local()).toFormat('m:ss'),
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
			cpm: _cpm(chars.complete, time.start ?? DateTime.local()),
			time: DateTime.local().diff(time.start ?? DateTime.local()).as('seconds'),
			hotStreak: res.hotStreak,
		});
	}

	return <div className="TrainerLine">
		{metronomeVolume > 0 && <Metronome bpm={metronome} volume={metronomeVolume} />}
		<div className="TrainerLine__typing">
			<TypingLine {...{
				onComplete: _onComplete,
				onType: _onType,
				onError: _onError,
				text
			}} />
		</div>
		<div className="TrainerLine__info">
			<div
				className="TrainerLine__info-item">{_p('TrainerLine', 'Errors: %1 (%2%%)', errors.total, errors.perc)}</div>
			<div className="TrainerLine__info-item">{_p('TrainerLine', 'Cpm: %1', _cpm(chars.complete, time.start ?? DateTime.local()))}</div>
			<div className="TrainerLine__info-center" />
			<div className="TrainerLine__info-item">{_p('TrainerLine', 'Time: %1', time.display)}</div>
			<div className="TrainerLine__info-item">{_p('TrainerLine', 'Chars: %1 / %2', chars.complete, chars.total)}</div>
		</div>
	</div>;
};
