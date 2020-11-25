import './KeyboardPage.scss';
import type { FunctionalComponent, Ref } from 'preact';
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
import { Intro, IntroContainerClass } from '../../components/Intro/Intro';
import clsx from 'clsx';
import type { User, UserKeyboard } from '../../components/Db/User';
import { DEFAULT_USER_KEYBOARD } from '../../components/Db/User';
import { inputNumberValue } from '../../utils/dom';
import { useUserKeyboardStats } from '../../components/Trainer/useUserKeyboardStats';
import { LessonRow } from './LessonRow';
import { KeyboardProgress } from './KeyboardProgress';
import { userKeyboard } from '../../utils/user';

const log = Logger.get('KeyboardPage');

export interface IKeyboardPageProps extends RoutableProps {
	id?: string;
}

export const KeyboardPage: FunctionalComponent<IKeyboardPageProps> = ({ id }) => {

	const { _p } = useContext(i18nContext);
	const [keyboard, setKeyboard] = useState<Keyboard | undefined>(undefined);
	const { user, setUser } = useContext(UserContext);
	const [haveStats, setHaveStats] = useState<boolean>(false);
	const [stats, lesson] = useUserKeyboardStats(user, keyboard);
	const uKey = userKeyboard(user, keyboard);
	const [ver, setVer] = useState<number>(1);
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

	function _saveConfig() {
		if (user && keyboard) {
			const cfg = uKey;
			cfg.metronome.tempo = inputNumberValue(ref.metronome.tempo.current, cfg.metronome.tempo)!;
			cfg.metronome.volume = Math.min(inputNumberValue(ref.metronome.volume.current, cfg.metronome.volume)! / 100, 1);
			cfg.strokes.initial = inputNumberValue(ref.strokes.initial.current, cfg.strokes.initial)!;
			cfg.strokes.lesson = inputNumberValue(ref.strokes.lesson.current, cfg.strokes.lesson)!;
			cfg.strokes.complete = inputNumberValue(ref.strokes.complete.current, cfg.strokes.complete)!;
			cfg.textGenerator.words = inputNumberValue(ref.textGen.words.current, cfg.textGenerator.words)!;
			cfg.textGenerator.maxWordLen = inputNumberValue(ref.textGen.maxWordLen.current, cfg.textGenerator.maxWordLen)!;
			cfg.textGenerator.minWordLen = inputNumberValue(ref.textGen.minWordLen.current, cfg.textGenerator.minWordLen)!;
			cfg.error.extraStrokes = inputNumberValue(ref.error.extraStrokes.current, cfg.error.extraStrokes)!;
			user.keyboards[keyboard.id] = cfg;
			setUser?.(user);
			Db.user.put(user);
			setVer(prev => prev + 1);
		}
	}

	function _onStart() {
		_saveConfig();
		route(url.practice(id!));
	}

	function _onStats() {
		route(url.stats(id!));
	}

	return <div className="KeyboardPage">
		<div className="KeyboardPage__body">
			<div className="KeyboardPage__box">
				{!_.isNil(keyboard) && <div className="KeyboardPage__header">
					<OtherKeyboard keyboard={keyboard} />
					<KeyboardProgress {...{
						className: 'KeyboardPage__progress',
						stats,
						strokes: uKey.strokes,
						extraStrokes: uKey.error.extraStrokes,
					}} />
				</div>}
				<div className="KeyboardPage__details">
					<div className="KeyboardPage__details-view">
						{_.map(keyboard?.lessons, (s, idx) => <LessonRow {...{
							key: idx,
							lesson: idx,
							keys: s,
							current: lesson,
							stats: stats,
							strokes: uKey.strokes,
							extraStrokes: uKey.error.extraStrokes,
						}} />)}
					</div>
					{haveStats && <div className="KeyboardPage__details-controls">
						<button className="KeyboardPage__stats-button" onClick={_onStats}><Icon
							img="chart-5" /> {_p('KeyboardPage', 'More Stats')}</button>
					</div>}
				</div>
				<div className="KeyboardPage__options">
					<div className="KeyboardPage__options-form">
						<fieldset className={clsx(IntroContainerClass, 'KeyboardPage__options-form-group')}>
							<legend data-intro="In training metronome configuration.">Metronome <Intro /></legend>
							<div data-intro="Ticks per minute metronome tempo.">
								<label>Tempo:</label>
								<input {...{
									ref: ref.metronome.tempo,
									type: 'number',
									defaultValue: uKey.metronome.tempo,
									min: 10,
									max: 400,
									onChange: _saveConfig,
								}} />
								bpm
							</div>
							<div data-intro="Metronome ticks volume percentage.">
								<label>Volume:</label>
								<input {...{
									ref: ref.metronome.volume,
									type: 'number',
									defaultValue: uKey.metronome.volume * 100,
									min: 0,
									max: 100,
									onChange: _saveConfig,
								}} />
								%
							</div>
						</fieldset>
						<fieldset className={clsx(IntroContainerClass, 'KeyboardPage__options-form-group')}>
							<legend data-intro="Configuration of training completion and lessons switch criteria.">Strokes <Intro />
							</legend>
							<div
								data-intro="Count of errorless strokes of keys in the lesson before adding already trained keys of keyboard.">
								<label>Initial:</label>
								<input {...{
									ref: ref.strokes.initial,
									type: 'number',
									defaultValue: uKey.strokes.initial,
									min: 0,
									max: 32768,
									onChange: _saveConfig,
								}} />
							</div>
							<div
								data-intro="Count of errorless strokes of each key in the lesson to consider the lesson is done and user can move forward.">
								<label>Lesson:</label>
								<input {...{
									ref: ref.strokes.lesson,
									type: 'number',
									defaultValue: uKey.strokes.lesson,
									min: 0,
									max: 32768,
									onChange: _saveConfig,
								}} />
							</div>
							<div
								data-intro="Count of errorless strokes of each key in the keyboard to consider keyboard training complete.">
								<label>Complete:</label>
								<input {...{
									ref: ref.strokes.complete,
									type: 'number',
									defaultValue: uKey.strokes.complete,
									min: 0,
									max: 32768,
									onChange: _saveConfig,
								}} />
							</div>
						</fieldset>
						<fieldset className={clsx(IntroContainerClass, 'KeyboardPage__options-form-group')}>
							<legend data-intro="Training text generating algorithms configuration.">Text Generator <Intro /></legend>
							<div data-intro="Count of generated words in one training session.">
								<label>Words:</label>
								<input {...{
									ref: ref.textGen.words,
									type: 'number',
									defaultValue: uKey.textGenerator.words,
									min: 10,
									max: 32768,
									onChange: _saveConfig,
								}} />
							</div>
							<div data-intro="One word length configuration. Minimal and maximal lengths.">
								<label>Word Length from:</label>
								<input {...{
									ref: ref.textGen.minWordLen,
									type: 'number',
									defaultValue: uKey.textGenerator.minWordLen,
									min: 1,
									max: 100,
									onChange: _saveConfig,
								}} />
								<label>to:</label>
								<input {...{
									ref: ref.textGen.maxWordLen,
									type: 'number',
									defaultValue: uKey.textGenerator.maxWordLen,
									min: 1,
									max: 100,
									onChange: _saveConfig,
								}} />
								chars
							</div>
						</fieldset>
						<fieldset className={clsx(IntroContainerClass, 'KeyboardPage__options-form-group')}>
							<legend data-intro="Errors penalty configuration.">Error Penalty <Intro /></legend>
							<div
								data-intro="Count of strokes that will be deducted from the total key strokes for every error in this key during training.">
								<label>Extra Strokes:</label>
								<input {...{
									ref: ref.error.extraStrokes,
									type: 'number',
									defaultValue: uKey.error.extraStrokes,
									min: 1,
									max: 32768,
									onChange: _saveConfig,
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
