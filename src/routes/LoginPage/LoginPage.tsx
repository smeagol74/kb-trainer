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

export const LoginPage: FunctionalComponent<RoutableProps> = ({}) => {

	const [users, setUsers] = useState<User[]>([]);
	const { setUser } = useContext(UserContext);
	const idRef = useRef<HTMLInputElement>();
	const nameRef = useRef<HTMLInputElement>();
	const { _p, _np } = useContext(i18nContext);

	useEffect(() => {
		Db.user.toArray().then(setUsers);
	}, [setUsers]);

	const onSelectUser = useCallback((user: User) => {
		setUser?.(user);
		route(url.user);
	}, [setUser]);

	const onRegisterClick = useCallback(() => {
		const user: User = {
			id: idRef.current.value,
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
				<div className="LoginPage__form-list">
					{!_.isEmpty(users) &&
					<h3 {...{
						dangerouslySetInnerHTML: {
							__html: _p('LoginPage', '* Select * some from <small>already registered users</small>'),
						},
					}} />}
					<ul>
						{_.map(users, (user, idx) => <li {...{ key: idx, onClick: _.partial(onSelectUser, user) }}>
							{user.name}
						</li>)}
					</ul>
				</div>
				<div className="LoginPage__form-register">
					<h3 {...{
						dangerouslySetInnerHTML: {
							__html: _p('LoginPage', '<small>or</small> + Register New + <small>user</small>'),
						},
					}} />
					<div className="LoginPage__form-group">
						<label>{_p('LoginPage', 'login:')}</label>
						<input {...{
							ref: idRef,
							type: 'text',
							name: 'id',
						}} />
					</div>
					<div className="LoginPage__form-group">
						<label>{_p('LoginPage', 'name:')}</label>
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
						}}>{_p('LoginPage', 'Register')}</button>
					</div>
				</div>
			</div>
		</div>
		<Menu />
	</div>;
};
