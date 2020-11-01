import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import './Home.scss';
import type { RoutableProps } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import type { Keyboard } from '../../components/Db/Keyboard';
import { useState } from 'preact/hooks';

export const Home: FunctionalComponent<RoutableProps> = () => {

	const [keyboards, setKeyboards] = useState<Keyboard[]>([]);

	return <div className="Home">
		<div className="Home__body">
		</div>
		<Menu />
	</div>;
};
