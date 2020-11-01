import './Login.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { RoutableProps } from 'preact-router';
import { route } from 'preact-router';
import type { User } from '../../components/Db/User';
import { useCallback, useContext, useEffect, useRef, useState } from 'preact/hooks';
import _ from 'lodash';
import { UserContext } from '../../App';
import { Db } from '../../components/Db/Db';
import { url } from '../sitemap';
import { Menu } from '../../components/Menu/Menu';


export const Login: FunctionalComponent<RoutableProps> = ({}) => {

	const [users, setUsers] = useState<User[]>([]);
	const { setUser } = useContext(UserContext);
	const idRef = useRef<HTMLInputElement>();
	const nameRef = useRef<HTMLInputElement>();

	useEffect(() => {
		Db.user.list().then(setUsers);
	}, [setUsers]);

	const onSelectUser = useCallback((user: User) => {
		setUser?.(user);
		route(url.home);
	}, [setUser]);

	const onRegisterClick = useCallback(() => {
		const user = {
			id: idRef.current.value,
			name: nameRef.current.value,
		};
		Db.user.put(user).then(() => {
			onSelectUser(user);
		});
	}, [setUser, onSelectUser]);

	return <div className="Login">
		<div className="Login__form">
			<div className="Login__list">
				{!_.isEmpty(users) && <h3>* Select * <small>some already registered user</small></h3>}
				<ul>
					{_.map(users, (user, idx) => <li {...{ key: idx, onClick: _.partial(onSelectUser, user) }}>
						{user.name}
					</li>)}
				</ul>
			</div>
			<div className="Login__register">
				<h3><small>or</small> + Register New + <small>user</small></h3>
				<div>
					<label>id:</label>
					<input {...{
						ref: idRef,
						type: 'text',
						name: 'id',
					}} />
				</div>
				<div>
					<label>name:</label>
					<input {...{
						ref: nameRef,
						type: 'text',
						name: 'name',
					}} />
				</div>
				<div>
					<button {...{
						className: 'Login__register-button',
						onClick: onRegisterClick,
					}}>Register
					</button>
				</div>
			</div>
		</div>
		<Menu/>
	</div>;
};
