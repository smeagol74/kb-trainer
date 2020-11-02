import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import './HomePage.scss';
import type { RoutableProps } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import type { Keyboard } from '../../components/Db/Keyboard';
import { useState } from 'preact/hooks';

export const HomePage: FunctionalComponent<RoutableProps> = () => {

	const [myKeyboards, setMyKeyboards] = useState<Keyboard[]>([]);
	const [otherKeyboards, setOtherKeyboards] = useState<Keyboard[]>([]);



	return <div className="HomePage">
		<div className="HomePage__body">

		</div>
		<Menu />
	</div>;
};
