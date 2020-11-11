import type { Keyboard, KeyboardLesson } from '../Db/Keyboard';
import type { User } from '../Db/User';
import type { StateUpdater } from 'preact/hooks';
import _ from 'lodash';
import { TextGenerator } from './TextGenerator';
import type { ITypingLineResults } from '../TypingLine/TypingLine';
import jsLogger from 'js-logger';
import { sumMerge } from '../../utils/stats';

const log = jsLogger.get('StudyCourse');

interface IKeys {
	keys: string[];
	shift: boolean;
}

const Key = {
	shift: 'Shift',
};

const ERROR_EXTRA_STROKES = 10;
const WORDS_FOR_LINE = 30;
const STROKES_FOR_GENERATOR = 10000;

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

export interface IStudyStats {
	strokes: Dict<number>;
	errors: Dict<number>;
}

export interface IStudyCourseOptions {
	user: User;
	keyboard: Keyboard;
	stats: IStudyStats;
	onSetUser: StateUpdater<User | undefined>;
	lesson?: number;
}

export class StudyCourse {

	private keyboard: Keyboard;
	private user: User;
	private onSetUser: StateUpdater<User | undefined>;
	private lessonIdx: number;
	private readonly metronome: number;
	private text: string[];
	private readonly stats: IStudyStats;
	private lastStats?: IStudyStats;

	constructor(props: IStudyCourseOptions) {
		log.debug('constructor', props);
		this.keyboard = props.keyboard;
		this.user = props.user;
		this.onSetUser = props.onSetUser;
		this.lessonIdx = props.lesson ?? this.user.keyboards[this.keyboard.id]?.lesson ?? 0;
		this.metronome = this.user.keyboards[this.keyboard.id]?.metronome ?? 100;
		this.text = [];
		this.stats = props.stats;
	}

	private statsKeyStrokesWithErrors(key: string): number {
		const strokes = this.stats.strokes[key] ?? 0;
		const errors = this.stats.errors[key] ?? 0;
		const res = strokes - (errors * ERROR_EXTRA_STROKES);
		return Math.max(res, 0);
	}

	private isInitialLessonComplete(keys: string[]): boolean {
		let result = true;
		_(keys).filter(key => key !== Key.shift).each(key => {
			result = result && (this.keyboard.strokes.initial < this.statsKeyStrokesWithErrors(key));
		});
		return result;
	}

	private keysToUse(): IKeys {
		const result: IKeys = {
			keys: [],
			shift: false,
		};
		const lesson = this.getLesson();
		if (this.isInitialLessonComplete(lesson.keys)) {
			result.keys = _(this.keyboard.script).slice(0, this.lessonIdx + 1).map('keys').flatten().value();
		} else {
			result.keys = lesson.keys;
		}
		result.shift = _.indexOf(result.keys, Key.shift) > -1;
		result.keys = _.filter(result.keys, c => c !== Key.shift);
		return result;
	}

	private weightedKeys(keys: string[]): string[] {
		log.debug(keys);
		let result: string[] = [];
		const strokes = _.map(keys, k => this.statsKeyStrokesWithErrors(k));
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
			this.text = TextGenerator.generate(this.keyboard.vocabulary, this.weightedKeys(keys.keys), keys.shift, WORDS_FOR_LINE);
		}
		return this.text;
	}

	getMetronome(): number {
		return this.metronome;
	}

	getLesson(): KeyboardLesson {
		return this.keyboard.script[this.lessonIdx];
	}

	getLessonNumber(): number {
		return this.lessonIdx + 1;
	}

	getLessonIdx(): number {
		return this.lessonIdx;
	}

	private sumMergeStats(stats: ITypingLineResults) {
		sumMerge(this.stats.strokes, stats.strokes);
		sumMerge(this.stats.errors, stats.errors);
		log.debug('sumMergeStats', this.stats);
	}

	private isLessonComplete(keys: string[], errors: number): boolean {
		let result = errors === 0;
		_(keys).filter(key => key !== Key.shift).each(key => {
			result = result && (this.keyboard.strokes.initial * 2 < this.statsKeyStrokesWithErrors(key));
		});
		return result;
	}

	complete(res: ITypingLineResults) {
		this.sumMergeStats(res);
		const lesson = this.getLesson();
		if (this.isLessonComplete(lesson.keys, _(res.errors).values().sum())) {
			this.lessonIdx = Math.min(this.lessonIdx + 1, this.keyboard.script.length - 1);
		}
		this.text = [];
		this.lastStats = res;
		if (this.lessonIdx > this.keyboard.script.length) {
			this.lessonIdx = this.keyboard.script.length - 1;
		}
	}

	hasSummary(): boolean {
		return !_.isEmpty(this.stats.strokes);
	}

	summary(): ISummaryData {
		const keys = _(this.keyboard.script).slice(0, this.lessonIdx + 1).map('keys').flatten().value();
		const result: ISummaryData = {
			keys,
			total: {
				strokes: _.map(keys, k => this.statsKeyStrokesWithErrors(k)),
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


}
