import type { FunctionalComponent } from 'preact';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'preact/hooks';
import { TypingChar } from './TypingChar';
import { h } from 'preact';
import './TypingLine.scss';

export interface ITypingLineProps {
	/**
	 *
	 */
	text: string[];
	onComplete: () => void;
}

const Modifier: Dict<boolean> = {
	Alt: true,
	Control: true,
	Shift: true,
	Meta: true,
};

const PARA = '¶';
const SHIFT = '⇧';
const ALT= '⌥';
const CTRL = '⌃';
const CMD = '⌘';

const Mod: Dict<string> = {
	// shiftKey
	[SHIFT]: 'Shift',
	shift: 'Shift',
	// altKey
	[ALT]: 'Alt',
	alt: 'Alt',
	option: 'Alt',
	// ctrlKey
	[CTRL]: 'Control',
	ctrl: 'Control',
	control: 'Control',
	// metaKey
	[CMD]: 'Meta',
	cmd: 'Meta',
	command: 'Meta',
	win: 'Meta',
};


export function _charMatches(char: string, event: KeyboardEvent): boolean {
	if (char.length === 1) {
		if (char === PARA) {
		  return event.key === 'Enter';
		} else {
			return char === event.key;
		}
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

export const TypingLine: FunctionalComponent<ITypingLineProps> = ({ text , onComplete}) => {

	const [pos, setPos] = useState<number>(0);
	const [errors, setErrors] = useState<number[]>(new Array(text.length + 1).fill(0));
	const keypress = useRef<(event: KeyboardEvent) => void>();

	useEffect(() => {
		keypress.current = (event) => {
			if (!Modifier[event.key]) {
				console.log(event);
				event.stopImmediatePropagation();
				event.preventDefault();
				event.stopPropagation();

				const char = pos < text.length ? text[pos] : PARA;

				if (_charMatches(char, event)) {
					if (pos >= text.length) {
						onComplete();
					} else {
						setPos((prev) => prev + 1);
					}
				} else {
					setErrors((prev) => {
						const res = [...prev];
						res[pos] += 1;
						return res;
					});
				}
			}
		};
	});

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

	return <div className="TypingLine">
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
			hasErrors: errors[pos]
		}}/>
	</div>;
};
