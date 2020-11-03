import './KeyboardPage.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { RoutableProps } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import { Icon } from '../../components/Icon/Icon';
import type { Keyboard } from '../../components/Db/Keyboard';
import { useContext, useEffect, useState } from 'preact/hooks';
import { UserContext } from '../../App';
import { Db } from '../../components/Db/Db';
import _ from 'lodash';
import { OtherKeyboard } from '../HomePage/OtherKeyboard';

export interface IKeyboardPageProps extends RoutableProps {
	id?: string;
}

export const KeyboardPage: FunctionalComponent<IKeyboardPageProps> = ({ id }) => {

	const [keyboard, setKeyboard] = useState<Keyboard | undefined>(undefined);
	const { user } = useContext(UserContext);

	useEffect(() => {
		if (!_.isEmpty(id)) {
			Db.keyboard.get(id!)
				.then(setKeyboard);
		}
	}, [id, setKeyboard]);


	return <div className="KeyboardPage">
		<div className="KeyboardPage__body">
			<div className="KeyboardPage__box">
				{!_.isNil(keyboard) && <OtherKeyboard keyboard={keyboard} className="KeyboardPage__header"/> }
				<div className="KeyboardPage__details">

				</div>
				<div className="KeyboardPage__options">
					<button className="KeyboardPage__start-button"><Icon img="rocket-19"/> Start</button>
				</div>
			</div>
		</div>
		<Menu />
	</div>;
};
