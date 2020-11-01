import './Menu.scss';
import type { FunctionalComponent } from 'preact';
import { useCallback, useContext } from 'preact/hooks';
import { UserContext } from '../../App';
import { Link, route } from 'preact-router';
import { url } from '../../routes/sitemap';
import { h } from 'preact';
import { Logo } from '../Logo/Logo';
import _ from 'lodash';

export interface IMenuProps {}

export const Menu: FunctionalComponent<IMenuProps> = ({children}) => {
	const {user, setUser} = useContext(UserContext);

	const onExit = useCallback(() => {
		setUser?.(undefined);
		route(url.login);
	}, [setUser]);

	return <div className="Menu">
		<Link className="Menu__logo" href={url.about}><Logo/></Link>
		{!_.isNil(user) && <Link className="Menu__user" href={url.home}>{user?.name}</Link>}
		{children}
		{!_.isNil(user) && <button className="Menu__logout" onClick={onExit}>Exit</button>}
	</div>
}
