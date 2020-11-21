import './KeyboardPage.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { RoutableProps } from 'preact-router';
import { route } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import { Icon } from '../../components/Icon/Icon';
import type { Keyboard } from '../../components/Db/Keyboard';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { i18nContext, UserContext } from '../../App';
import { Db } from '../../components/Db/Db';
import _ from 'lodash';
import { OtherKeyboard } from '../UserPage/OtherKeyboard';
import { url } from '../sitemap';
import Logger from 'js-logger';

const log = Logger.get('KeyboardPage');

export interface IKeyboardPageProps extends RoutableProps {
	id?: string;
}


export const KeyboardPage: FunctionalComponent<IKeyboardPageProps> = ({ id }) => {

	const { _p } = useContext(i18nContext);
	const [keyboard, setKeyboard] = useState<Keyboard | undefined>(undefined);
	const { user } = useContext(UserContext);
	const [haveStats, setHaveStats] = useState<boolean>(false);
	const ref = {
		metronome: {
			tempo: useRef<HTMLInputElement>(),
			volume: useRef<HTMLInputElement>(),
		},
		strokes: {
			initial: useRef<HTMLInputElement>(),
			lesson: useRef<HTMLInputElement>(),
			complete: useRef<HTMLInputElement>(),
		},
		textGen: {
			words: useRef<HTMLInputElement>(),
			minWordLen: useRef<HTMLInputElement>(),
			maxWordLen: useRef<HTMLInputElement>(),
		},
		error: {
			extraStrokes: useRef<HTMLInputElement>(),
		},
	};

	useEffect(() => {
		if (!_.isEmpty(id)) {
			Db.keyboard.get(id!)
				.then(setKeyboard);
		}
	}, [id, setKeyboard]);

	useEffect(() => {
		if (!_.isEmpty(id)) {
			Db.progress.where({
				user: user?.id,
				keyboard: id,
			}).count()
				.then(c => setHaveStats(c > 0));
		}
	}, [id, user, setHaveStats]);

	function _onStart() {
		route(url.practice(id!));
	}

	function _onStats() {
		route(url.stats(id!));
	}

	return <div className="KeyboardPage">
		<div className="KeyboardPage__body">
			<div className="KeyboardPage__box">
				{!_.isNil(keyboard) && <OtherKeyboard keyboard={keyboard} className="KeyboardPage__header" />}
				<div className="KeyboardPage__details">
					<div className="KeyboardPage__details-view">
						{_.map(keyboard?.lessons, (s, idx) => <div key={idx}>
							<strong>Lesson {idx + 1}:</strong>
							{_.map(s, (k, kidx) => <kbd key={`${idx}-${kidx}`}>{k}</kbd>)}
						</div>)}
					</div>
					{haveStats && <div className="KeyboardPage__details-controls">
						<button className="KeyboardPage__stats-button" onClick={_onStats}><Icon
							img="chart-5" /> {_p('KeyboardPage', 'More Stats')}</button>
					</div>}
				</div>
				<div className="KeyboardPage__options">
					<div className="KeyboardPage__options-form">
						<fieldset>
							<legend>Metronome</legend>
							<div>
								<label>Tempo:</label>
								<input {...{
									ref: ref.metronome.tempo,
									type: 'number',
									defaultValue: 50,
									min: 10,
									max: 400,
								}} />
							</div>
							<div>
								<label>Volume</label>
								<input {...{
									ref: ref.metronome.volume,
									type: 'number',
									defaultValue: 100,
									min: 0,
									max: 100,
								}} />
							</div>
						</fieldset>
						<fieldset>
							<legend>Strokes</legend>
							<div>
								<label>Initial</label>
								<input {...{
									ref: ref.strokes.initial,
									type: 'number',
									defaultValue: 100,
								}} />
							</div>
							<div>
								<label>Lesson</label>
								<input {...{
									ref: ref.strokes.lesson,
									type: 'number',
									defaultValue: 200,
								}} />
							</div>
							<div>
								<label>Complete</label>
								<input {...{
									ref: ref.strokes.complete,
									type: 'number',
									defaultValue: 2000,
								}} />
							</div>
						</fieldset>
						<fieldset>
							<legend>Text Generator</legend>
							<div>
								<label>Words</label>
								<input {...{
									ref: ref.textGen.words,
									type: 'number',
									defaultValue: 30,
								}} />
							</div>
							<div>
								<label>Min Word Length</label>
								<input {...{
									ref: ref.textGen.minWordLen,
									type: 'number',
									defaultValue: 2,
								}} />
							</div>
							<div>
								<label>Max Word Length</label>
								<input {...{
									ref: ref.textGen.maxWordLen,
									type: 'number',
									defaultValue: 5,
								}} />
							</div>
						</fieldset>
						<fieldset>
							<legend>Error Penalty</legend>
							<div>
								<label>Extra Strokes</label>
								<input {...{
									ref: ref.error.extraStrokes,
									type: 'number',
									defaultValue: 10,
								}} />
							</div>
						</fieldset>
					</div>
					<div className="KeyboardPage__options-controls">
						<button className="KeyboardPage__start-button" onClick={_onStart}><Icon
							img="rocket-19" /> {_p('KeyboardPage', 'Start Training')}
						</button>
					</div>
				</div>
			</div>
		</div>
		<Menu />
	</div>;
};
