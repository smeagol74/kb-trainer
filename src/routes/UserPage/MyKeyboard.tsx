import './MyKeyboard.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { Keyboard } from '../../components/Db/Keyboard';
import { Icon } from '../../components/Icon/Icon';
import clsx from 'clsx';
import { route } from 'preact-router';
import { url } from '../sitemap';
import { useContext } from 'preact/hooks';
import { i18nContext, UserContext } from '../../App';
import { userKeyboard } from '../../utils/user';
import { KeyboardProgress } from '../KeyboardPage/KeyboardProgress';
import { useUserKeyboardStats } from '../../components/Trainer/useUserKeyboardStats';

export interface IMyKeyboardProps {
	keyboard: Keyboard;
	className?: string;
}

export const MyKeyboard: FunctionalComponent<IMyKeyboardProps> = ({ keyboard, className }) => {
	const { user } = useContext(UserContext);
	const uKey = userKeyboard(user, keyboard);
	const { _p } = useContext(i18nContext);
	const [stats] = useUserKeyboardStats(user, keyboard);

	function _onClick() {
		route(url.keyboard(keyboard.id));
	}

	return <div className={clsx('MyKeyboard', className)} onClick={_onClick}>
		<div className="MyKeyboard__row">
			<div className="MyKeyboard__desc">
				<div className='MyKeyboard__desc-title'><Icon className="MyKeyboard__desc-title-icon" img="keyboard-4"
																											size="lg" />{keyboard.name}</div>
				<div className="MyKeyboard__desc-value">{keyboard.description}</div>
			</div>
			<div className="MyKeyboard__block">
				<div className="MyKeyboard__block-label">{_p('MyKeyboard', 'keys:')}</div>
				<div className="MyKeyboard__block-value">{keyboard.keys.length}</div>
			</div>
		</div>
		{stats && <KeyboardProgress {...{
			className: 'MyKeyboard__progress',
			stats,
			strokes: uKey.strokes,
			extraStrokes: uKey.error.extraStrokes,
		}} />}
	</div>;
};
