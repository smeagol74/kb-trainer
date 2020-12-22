import type { Keyboard, KeyboardLesson } from '../Db/Keyboard';
import type { User, UserKeyboard } from '../Db/User';
import type { StateUpdater } from 'preact/hooks';
import _ from 'lodash';
import { TextGenerator } from './TextGenerator';
import type { ITypingLineResults } from '../TypingLine/TypingLine';
import jsLogger from 'js-logger';
import { sumMerge } from '../../utils/stats';
import type { ITrainerLineResults } from './TrainerLine';
import { userKeyboard } from '../../utils/user';
import { Db } from '../Db/Db';
import type { StudyStats } from './StudyStats';
import { firstIncompleteLesson, isInitialLessonComplete, isLessonComplete, keyStrokesWithErrors } from './StudyStats';

const log = jsLogger.get('StudyCourse');

interface IKeys {
	keys: string[];
	shift: number;
}

const Key = {
	shift: 'Shift',
};

const STROKES_FOR_GENERATOR = 10000;
const VOCABULARY = 'random';

export interface ISummaryData {
	keys: string[],
	total: {
		strokes: number[],
		errors: number[]
	},
	lesson?: {
		strokes: number[],
		errors: number[]
	}
}

export interface IStudyCourseOptions {
	user: User;
	keyboard: Keyboard;
	stats: StudyStats;
	onSetUser: StateUpdater<User | undefined>;
}

export class StudyCourse {

	private keyboard: Keyboard;
	private user: User;
	private onSetUser: StateUpdater<User | undefined>;
	private lessonIdx: number;
	private text: string[];
	private readonly stats: StudyStats;
	private lastStats?: StudyStats;
	private config: UserKeyboard;
	private configModified: boolean;

	constructor(props: IStudyCourseOptions) {
		log.debug('constructor', props);
		this.keyboard = props.keyboard;
		this.user = props.user;
		this.onSetUser = props.onSetUser;
		this.config = userKeyboard(props.user, props.keyboard);
		this.text = [];
		this.stats = props.stats;
		this.configModified = false;
		this.lessonIdx = 0;
		this._selectBestLesson(0);
	}

	private _statsKeyStrokesWithErrors(key: string): number {
		return keyStrokesWithErrors(this.stats, this.config.error.extraStrokes, key);
	}

	private _isInitialLessonComplete(keys: string[]): boolean {
		return isInitialLessonComplete(this.config, this.stats, keys);
	}

	private keysToUse(): IKeys {
		const result: IKeys = {
			keys: [],
			shift: 0,
		};
		const lesson = this.getLesson();
		if (this._isInitialLessonComplete(lesson)) {
			result.keys = _(this.keyboard.lessons).slice(0, this.lessonIdx + 1).flatten().value();
		} else {
			result.keys = lesson;
		}
		if (_.indexOf(result.keys, Key.shift) > -1) {
			const strokes = _.map(result.keys, k => this._statsKeyStrokesWithErrors(k));
			const shift = this._statsKeyStrokesWithErrors(Key.shift);
			const total = _.sum(strokes);
			const max = _.max(strokes) ?? 0;
			if (max > 0) {
				result.shift = (max - shift) / (max * 2);
			}
		}
		result.keys = _.filter(result.keys, c => c !== Key.shift);
		log.debug('keysToUse', result);
		return result;
	}

	private weightedKeys(keys: string[]): string[] {
		log.debug(keys);
		let result: string[] = [];
		const strokes = _.map(keys, k => this._statsKeyStrokesWithErrors(k));
		log.debug('strokes:', strokes);
		const total = _.sum(strokes);
		const max = _.max(strokes) ?? 0;
		const min = _.min(strokes) ?? 0;
		log.debug('total:', total, 'max:', max, 'min:', min);
		const minRStroke = (keys.length > 2) ? Math.max((max - min) / 20, 1) : (max - min);
		const midRStroke = (keys.length > 2) ? 0 : Math.max((max - min) / 5, 1);
		const rstrokes = (total > 0)
			? _(strokes)
				.map(s => Math.max(max - s, minRStroke))
				.map(s => Math.round((midRStroke + s) / total * STROKES_FOR_GENERATOR))
				.value()
			: _(strokes)
				.map(() => 1)
				.value();
		log.debug('rstrokes', rstrokes);
		_.each(keys, (k, i) => {
			const len = rstrokes[i];
			result = result.concat(_.fill(new Array(len), k));
		});
		return result;
	}

	getText(): string[] {
		if (_.isEmpty(this.text)) {
			const keys = this.keysToUse();
			this.text = TextGenerator.generate(VOCABULARY,
				this.weightedKeys(keys.keys),
				keys.shift,
				this.config.textGenerator.words,
				this.config.textGenerator.minWordLen,
				this.config.textGenerator.maxWordLen);
		}
		return this.text;
	}

	getLesson(): KeyboardLesson {
		return this.keyboard.lessons[this.lessonIdx];
	}

	getLessonNumber(): number {
		return this.lessonIdx + 1;
	}

	getLessonIdx(): number {
		return this.lessonIdx;
	}

	private _sumMergeStats(stats: ITypingLineResults) {
		sumMerge(this.stats.strokes, stats.strokes);
		sumMerge(this.stats.errors, stats.errors);
		log.debug('_sumMergeStats', this.stats);
	}

	private _resetMetronomeHotStreak() {
		if (this.config.metronome.hotStreak > 0) {
			this.configModified = true;
		}
		this.config.metronome.hotStreak = 0;
	}

	private _incMetronomeHotStreak(value: number, errors: number, cpm: number) {
		const tempo = cpm > 0 ? cpm : this.config.metronome.tempo;
		if (errors > 0) {
			this.config.metronome.hotStreak = value;
			this.config.metronome.tempo = Math.max(tempo - this.config.metronome.dec, 30);
		} else {
			this.config.metronome.hotStreak += value;
			if (this.config.metronome.hotStreak > this.config.metronome.speedUp) {
				this.config.metronome.hotStreak = 0;
				this.config.metronome.tempo = tempo + this.config.metronome.inc;
			}
		}
		this.configModified = true;
	}

	private _isLessonsComplete(): boolean {
		const keys = _(this.keyboard.lessons).flatten().value();
		return isLessonComplete(this.config, this.stats, keys);
	}

	private _incHotStreak(value: number, errors: number) {
		if (errors > 0) {
			this.config.error.hotStreak = value;
		} else {
			this.config.error.hotStreak += value;
		}
		this.config.error.bestHotStreak = Math.max(this.config.error.bestHotStreak, this.config.error.hotStreak);
		this.configModified = true;
	}

	private _saveConfig() {
		if (this.configModified) {
			const user = this.user;
			const _onSetUser = this.onSetUser;
			user.keyboards[this.keyboard.id] = {
				...this.config,
			};
			log.debug('_saveConfig', this.keyboard.id, user.keyboards);
			const onSetUser = () => {
				_onSetUser(user);
			};
			Db.user.put(this.user).then(onSetUser);
			this.configModified = false;
		}
	}

	private _selectBestLesson(errors: number) {
		let idx = firstIncompleteLesson(this.config, this.stats, this.keyboard.lessons);
		if ((idx === this.lessonIdx + 1) && errors > 0) {
			idx = this.lessonIdx;
		}
		idx = Math.min(idx, this.keyboard.lessons.length - 1);
		this.lessonIdx = idx;
	}

	complete(res: ITrainerLineResults) {
		this._sumMergeStats(res);
		const totalErrors = _(res.errors).values().sum();
		this._incHotStreak(res.hotStreak, totalErrors);

		if (this._isLessonsComplete()) {
			this._incMetronomeHotStreak(res.hotStreak, totalErrors, res.cpm);
		} else {
			this._selectBestLesson(totalErrors);
			if (this._isLessonsComplete()) {
				this._resetMetronomeHotStreak();
			}
		}

		this.text = [];
		this.lastStats = res;
		if (this.lessonIdx > this.keyboard.lessons.length) {
			this.lessonIdx = this.keyboard.lessons.length - 1;
		}
		this._saveConfig();
	}

	hasSummary(): boolean {
		return !_.isEmpty(this.stats.strokes);
	}

	summary(): ISummaryData {
		const keys = _(this.keyboard.lessons).slice(0, this.lessonIdx + 1).flatten().value();
		const result: ISummaryData = {
			keys,
			total: {
				strokes: _.map(keys, k => this._statsKeyStrokesWithErrors(k)),
				errors: _.map(keys, k => this.stats.errors[k] ?? 0),
			},
		};
		if (this.lastStats) {
			result.lesson = {
				strokes: _.map(keys, k => this.lastStats?.strokes[k] ?? 0),
				errors: _.map(keys, k => this.lastStats?.errors[k] ?? 0),
			};
		}
		return result;
	}


	getConfig(): UserKeyboard {
		return this.config;
	}

	getStats(): StudyStats {
		return this.stats;
	}

	areLessonsIncomplete(): boolean {
		return !this._isLessonsComplete();
	}

}
