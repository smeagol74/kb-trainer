import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { route, Router, RouterOnChangeArgs } from 'preact-router';
import { Home } from './Home/Home';
import { Login } from './Login/Login';
import { useCallback, useContext } from 'preact/hooks';
import { rt, url } from './sitemap';
import _ from 'lodash';
import { UserContext } from '../App';
import { About } from './About/About';
import { Keyboard } from './Keyboard/Keyboard';
import { Practice } from './Practice/Practice';

export interface IRoutesProps {
}

export const Routes: FunctionalComponent<IRoutesProps> = () => {

	const { user } = useContext(UserContext);

	const onRouteChange = useCallback((e: RouterOnChangeArgs) => {
		if (_.isEmpty(user) && url.login !== e.url && url.about !== e.url) {
			route(url.login, true);
		}
	}, [user]);

	return (<Router onChange={onRouteChange}>
		<Home path={rt.home} />
		<Login path={rt.login} />
		<About path={rt.about} />
		<Keyboard path={rt.keyboard}/>
		<Practice path={rt.practice}/>
	</Router>);
};
