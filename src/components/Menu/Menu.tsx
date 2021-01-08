import './Menu.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { useContext, useRef } from 'preact/hooks';
import { i18nContext, UserContext } from '../../App';
import { Link } from 'preact-router';
import { url } from '../../routes/sitemap';
import { Logo } from '../Logo/Logo';
import _ from 'lodash';
import { Icon } from '../Icon/Icon';
import { Action, analytics, Category } from '../../utils/analytics';

export interface IMenuProps {
}

export const Menu: FunctionalComponent<IMenuProps> = ({ children }) => {
	const { user } = useContext(UserContext);
	const { _p, setLang, lang } = useContext(i18nContext);
	const langRef = useRef<HTMLSelectElement>();

	const onLanguageChange = (event: Event) => {
		if (langRef.current) {
			setLang(langRef.current.value);
			analytics.trackEvent(Category.LanguageSwitch, Action.changeTo(langRef.current.value));
		}
	};

	return <div className="Menu">
		<Link className="Menu__logo" href={url.home}><Logo /></Link>
		{!_.isNil(user) && <Link className="Menu__user" href={url.user}>{_p('Menu', 'Keyboards')}</Link>}
		<div className="Menu__spacer" />
		{children}
		<div className="Menu__spacer" />
		<div className={'Menu__donate'}>
			<a
				href={'https://paypal.me/irbis74'}
				className={'Menu__donate-button'}
				rel={'noreferrer nofollow'}
			>
				<Icon img={'coffee-1'} size={'sm'} />{' '}
				{_p('Menu', 'Buy me some tea...')}
			</a>
		</div>
		<div className="Menu__language">
			<select ref={langRef} onChange={onLanguageChange} value={lang}>
				<option value="ru">ru</option>
				<option value="en">en</option>
			</select>
		</div>
	</div>;
};
