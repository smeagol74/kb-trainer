import './MyKeyboard.scss';
import type { FunctionalComponent } from 'preact';
import type { Keyboard } from '../../components/Db/Keyboard';
import { h } from 'preact';
import { Icon } from '../../components/Icon/Icon';
import _ from 'lodash';
import clsx from 'clsx';
import { route } from 'preact-router';
import { url } from '../sitemap';

export interface IMyKeyboardProps {
	keyboard: Keyboard;
	className?: string;
}

export const MyKeyboard: FunctionalComponent<IMyKeyboardProps> = ({ keyboard, className }) => {

	function _onClick() {
		route(url.keyboard(keyboard.id));
	}

	return <div className={clsx('MyKeyboard', className)} onClick={_onClick}>
		<div className="MyKeyboard__desc">
			<div className='MyKeyboard__desc-title'><Icon className="MyKeyboard__desc-title-icon" img="keyboard-4"
																										size="lg" />{keyboard.name}</div>
			<div className="MyKeyboard__desc-value">{keyboard.description}</div>
		</div>
		<div className="MyKeyboard__block">
			<div className="MyKeyboard__block-label">keys:</div>
			<div className="MyKeyboard__block-value">{_(keyboard.lessons).flatten().size()}</div>
		</div>
	</div>;
};
