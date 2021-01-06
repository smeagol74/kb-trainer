import type { FunctionalComponent } from 'preact';
import clsx from 'clsx';
import { h } from 'preact';
import './TypingChar.scss';
import { keyName } from '../../utils/keyboard';

export interface ITypingCharProps {
	char: string;
	isCurrent: boolean;
	isTyped: boolean;
	hasErrors: number;
}

export const TypingChar: FunctionalComponent<ITypingCharProps> = ({ char, isCurrent, isTyped, hasErrors }) => {
	const className = clsx('TypingChar', {
		'TypingChar--current': isCurrent,
		'TypingChar--typed': isTyped,
		'TypingChar--future': !isTyped && !isCurrent,
		'TypingChar--error': hasErrors > 0,
		'TypingChar--space': char === ' ',
		'TypingChar--kbd': char.length > 1,
	});
	if (char.length === 1) {
		if (char === ' ') {
			return <span className={className}>&nbsp;</span>;
		} else {
			return <span className={className}>{keyName(char)}</span>;
		}
	} else {
		return <kbd className={className}>{keyName(char)}</kbd>;
	}
};
