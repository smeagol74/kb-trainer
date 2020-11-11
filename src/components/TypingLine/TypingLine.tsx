import type { FunctionalComponent } from 'preact';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'preact/hooks';
import { TypingChar } from './TypingChar';
import { h } from 'preact';
import './TypingLine.scss';
import jsLogger from 'js-logger';

const log = jsLogger.get('TypingLine');

export interface ITypingLineResults {
	strokes: Dict<number>;
	errors: Dict<number>;
}

export interface ITypingLineProps {
	/**
	 *
	 */
	text: string[];
	onComplete: (results: ITypingLineResults) => void;
	onType: (complete: number) => void;
	onError: (errors: number) => void;
}

const Modifier: Dict<boolean> = {
	Alt: true,
	Control: true,
	Shift: true,
	Meta: true,
};

const PARA = '¶';
const SHIFT = '⇧';
const ALT = '⌥';
const CTRL = '⌃';
const CMD = '⌘';

function _key(value: string, ...aliases: string[]): Dict<string> {
	const res: Dict<string> = {
		[value.toLowerCase()]: value,
	};
	_(aliases).each((alias) => {
		res[alias.toLowerCase()] = value;
	});
	return res;
}

function _fkeys(): Dict<string> {
	const res: Dict<string> = {};
	for (let i = 1; i <= 24; i++) {
		const value = `F${i}`;
		res[`f${i}`] = value;
		res[`f-${i}`] = value;
	}
	return res;
}

const Mod: Dict<string> = {
	..._key('Shift', SHIFT),
	..._key('Alt', ALT, 'option'),
	..._key('Control', CTRL, 'ctrl'),
	..._key('Meta', CMD, 'cmd', 'command', 'win'),
};

const Special: Dict<string> = {
	..._key('Backspace', 'back'),
	..._key('Enter', 'return'),
	..._key('Escape', 'esc'),
	..._fkeys(),
	..._key('Tab'),
	..._key('PageUp', 'pgup'),
	..._key('PageDown', 'pgdn'),
	..._key('Home'),
	..._key('End'),
};


export function _charMatches(char: string, event: KeyboardEvent): boolean {
	if (char.length === 1) {
		if (char === PARA) {
			return event.key === 'Enter';
		} else {
			return char === event.key;
		}
	} else if (Special[char.toLowerCase()]) {
		return event.key === Special[char.toLowerCase()];
	} else {
		const symbols = char.split('+');
		let result = true;
		_.each(symbols, (c) => {
			if (Mod[c.toLowerCase()]) {
				result = result && event.getModifierState(Mod[c.toLowerCase()]);
			} else {
				result = result && c === event.key;
			}
		});
		return result;
	}
}

function _incCharStats(idx: number, char: string, errors: number[], result: ITypingLineResults) {
	result.strokes[char] = result.strokes[char] ?? 0;
	result.errors[char] = result.errors[char] ?? 0;
	result.strokes[char] += 1;
	result.errors[char] += errors[idx];
}

export function _isShifted(char: string): boolean {
	return char === char.toUpperCase() && char !== char.toLowerCase();
}

function _mkResults(errors: number[], text: string[]): ITypingLineResults {

	const result: ITypingLineResults = {
		strokes: {
			Enter: 1,
		},
		errors: {
			Enter: errors[text.length],
		},
	};
	_.each(text, (char, idx) => {
		if (char.length === 1) {
			_incCharStats(idx, char.toLowerCase(), errors, result);
			if (_isShifted(char)) {
				_incCharStats(idx, 'Shift', errors, result);
			}
		} else {
			_(char.split('+'))
				.map(c => Mod[c] ?? Special[c] ?? c)
				.each(c => _incCharStats(idx, c, errors, result));
		}
	});
	return result;
}

export const scrollCharIntoVewType: 'scroll-char-into-view' = 'scroll-char-into-view';

export interface ScrollCharIntoViewDetail {
	charIndex: number;
}

export class ScrollCharIntoViewEvent extends CustomEvent<ScrollCharIntoViewDetail> {
	constructor(detail: ScrollCharIntoViewDetail) {
		super(scrollCharIntoVewType, { detail });
	}
}

declare global {
	interface WindowEventMap {
		[scrollCharIntoVewType]: ScrollCharIntoViewEvent
	}
}

export const TypingLine: FunctionalComponent<ITypingLineProps> = ({ text, onComplete, onType, onError }) => {

	const [pos, setPos] = useState<number>(0);
	const [errors, setErrors] = useState<number[]>(new Array(text.length + 1).fill(0));
	const keypress = useRef<(event: KeyboardEvent) => void>();
	const complete = useRef<() => void>();
	const ref = useRef<HTMLDivElement>();

	useEffect(() => {
		function _scroll(event: ScrollCharIntoViewEvent) {
			if (ref.current) {
				const char = ref.current.querySelector(`.TypingChar:nth-child(${event.detail.charIndex + 1})`);
				if (char) {
					char.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'center',
					});
				}
			}
		}

		window.addEventListener(scrollCharIntoVewType, _scroll);

		return () => {
			window.removeEventListener(scrollCharIntoVewType, _scroll);
		};
	}, [ref]);

	useEffect(() => {
		complete.current = () => {
			onComplete(_mkResults(errors, text));
		};
	}, [onComplete, errors, text]);

	useEffect(() => {
		keypress.current = (event) => {
			const char = pos < text.length ? text[pos] : PARA;
			if (_charMatches(char, event)) {
				event.stopImmediatePropagation();
				event.preventDefault();
				event.stopPropagation();
				if (pos >= text.length) {
					complete.current();
				} else {
					setPos((prev) => {
						const res = prev + 1;
						onType(res);
						window.dispatchEvent(new ScrollCharIntoViewEvent({ charIndex: res }));
						return res;
					});
				}
			} else {
				if (!Modifier[event.key] || Modifier[Mod[char]]) {
					setErrors((prev) => {
						const res = [...prev];
						res[pos] += 1;
						onError(_(res).filter(v => v > 0).size());
						return res;
					});
				}
			}
		};
	}, [onComplete, setErrors, setPos, onType, onError]);

	useEffect(() => {
		const _onKeypress = (event: KeyboardEvent) => {
			if (keypress.current) {
				keypress.current(event);
			}
		};
		window.addEventListener('keydown', _onKeypress);
		return () => {
			window.removeEventListener('keydown', _onKeypress);
		};
	}, [keypress]);

	return <div className="TypingLine" ref={ref}>
		{_.map(text, (char, idx) => <TypingChar {...{
			char,
			isCurrent: idx === pos,
			isTyped: idx < pos,
			hasErrors: errors[idx],
		}} />)}
		<TypingChar {...{
			char: PARA,
			isCurrent: pos === text.length,
			isTyped: false,
			hasErrors: errors[pos],
		}} />
		<TypingChar {...{
			char: ' ',
			isCurrent: false,
			isTyped: false,
			hasErrors: 0,
		}} />
	</div>;
};
