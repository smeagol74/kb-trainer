import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { route, Router, RouterOnChangeArgs } from 'preact-router';
import { useCallback, useContext } from 'preact/hooks';
import { rt, url } from './sitemap';
import _ from 'lodash';
import { UserContext } from '../App';
import { PracticePage } from './PracticePage/PracticePage';
import { KeyboardPage } from './KeyboardPage/KeyboardPage';
import { AboutPage } from './AboutPage/AboutPage';
import { LoginPage } from './LoginPage/LoginPage';
import { UserPage } from './UserPage/UserPage';

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
		<UserPage path={rt.user} />
		<LoginPage path={rt.login} />
		<AboutPage path={rt.about} />
		<KeyboardPage path={rt.keyboard}/>
		<PracticePage path={rt.practice}/>
	</Router>);
};
