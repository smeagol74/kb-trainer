import './OtherKeyboard.scss';
import type { FunctionalComponent } from 'preact';
import type { Keyboard } from '../../components/Db/Keyboard';
import { h } from 'preact';
import _ from 'lodash';
import clsx from 'clsx';
import { route } from 'preact-router';
import { url } from '../sitemap';
import { Icon } from '../../components/Icon/Icon';

export interface IOtherKeyboardProps {
	keyboard: Keyboard,
	className?: string
}

export const OtherKeyboard: FunctionalComponent<IOtherKeyboardProps> = ({ keyboard, className }) => {

	function _onClick() {
		route(url.keyboard(keyboard.id));
	}

	return <div className={clsx('OtherKeyboard', className)} onClick={_onClick}>
		<div className="OtherKeyboard__desc">
			<div className='OtherKeyboard__desc-title'><Icon  className="OtherKeyboard__desc-title-icon" img="keyboard-4"/>{keyboard.name}</div>
			<div className="OtherKeyboard__desc-value">{keyboard.description}</div>
		</div>
		<div className="OtherKeyboard__block">
			<div className="OtherKeyboard__block-label">keys:</div>
			<div className="OtherKeyboard__block-value">{_(keyboard.script).map('keys').flatten().size()}</div>
		</div>
	</div>;
};
