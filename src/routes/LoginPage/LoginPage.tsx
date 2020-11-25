import './LoginPage.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { RoutableProps } from 'preact-router';
import { route } from 'preact-router';
import type { User } from '../../components/Db/User';
import { useCallback, useContext, useEffect, useRef, useState } from 'preact/hooks';
import _ from 'lodash';
import { i18nContext, UserContext } from '../../App';
import { Db } from '../../components/Db/Db';
import { url } from '../sitemap';
import { Menu } from '../../components/Menu/Menu';
import { Icon } from '../../components/Icon/Icon';

export const LoginPage: FunctionalComponent<RoutableProps> = ({}) => {

	const { setUser } = useContext(UserContext);
	const nameRef = useRef<HTMLInputElement>();
	const { _p, _np } = useContext(i18nContext);

	const onSelectUser = useCallback((user: User) => {
		setUser?.(user);
		route(url.user);
	}, [setUser]);

	useEffect(() => {
		if (setUser) {
			Db.user.toArray().then((users) => {
				if (users.length > 0) {
					onSelectUser(users[0]);
				}
			});
		}
	}, [setUser, onSelectUser]);

	const onRegisterClick = useCallback(() => {
		const user: User = {
			id: 'user',
			name: nameRef.current.value,
			keyboards: {},
		};
		if (!_.isEmpty(user.id) && !_.isEmpty(user.name)) {
			Db.user.get(user.id).then(dbUser => {
				if (!_.isEmpty(dbUser)) {
					user.keyboards = dbUser!.keyboards;
				}
				Db.user.put(user).then(() => {
					onSelectUser(user);
				});
			});
		}
	}, [setUser, onSelectUser]);

	return <div className="LoginPage">
		<div className="LoginPage__body">
			<div className="LoginPage__form">
				<div className="LoginPage__form-register">
					<h3>{_p('LoginPage', 'Welcome to kb-trainer')}</h3>
					<p>{_p('LoginPage', 'Please type your name, so I know how to address to you')}</p>
					<div className="LoginPage__form-group">
						<input {...{
							ref: nameRef,
							type: 'text',
							name: 'name',
						}} />
					</div>
					<div className="LoginPage__form-group">
						<button {...{
							className: 'LoginPage__form-register-button',
							onClick: onRegisterClick,
						}}><Icon img={'rocket-19'} /> {_p('LoginPage', 'Go')}</button>
					</div>
				</div>
			</div>
		</div>
		<Menu />
	</div>;
};
