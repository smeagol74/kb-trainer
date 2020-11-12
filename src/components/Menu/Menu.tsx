import './Menu.scss';
import type { FunctionalComponent } from 'preact';
import { useCallback, useContext, useEffect, useRef, useState } from 'preact/hooks';
import { i18nContext, UserContext } from '../../App';
import { Link, route } from 'preact-router';
import { url } from '../../routes/sitemap';
import { h } from 'preact';
import { Logo } from '../Logo/Logo';
import _ from 'lodash';
import { Icon } from '../Icon/Icon';

export interface IMenuProps {
}

export const Menu: FunctionalComponent<IMenuProps> = ({ children }) => {
	const { user, setUser } = useContext(UserContext);
	const { __, setLang, lang } = useContext(i18nContext);
	const langRef = useRef<HTMLSelectElement>();

	const onExit = useCallback(() => {
		setUser?.(undefined);
		route(url.login);
	}, [setUser]);

	const onLanguageChange = (event: Event) => {
		if (langRef.current) {
			setLang(langRef.current.value);
		}
	};

	return <div className="Menu">
		<Link className="Menu__logo" href={url.about}><Logo /></Link>
		{!_.isNil(user) && <Link className="Menu__user" href={url.home}>{user?.name}</Link>}
		<div className="Menu__spacer" />
		{children}
		<div className="Menu__spacer" />
		<div className="Menu__language">
			<select ref={langRef} onChange={onLanguageChange}>
				<option value="ru" selected={lang === 'ru'}>ru</option>
				<option value="en" selected={lang === 'en'}>en</option>
			</select>
		</div>
		{!_.isNil(user) &&
		<button className="Menu__logout" onClick={onExit}><Icon img="door-6" size="sm" /> {__('Exit')}
		</button>}
	</div>;
};
