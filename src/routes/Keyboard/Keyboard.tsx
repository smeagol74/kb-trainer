import './Keyboard.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { RoutableProps } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';

export const Keyboard: FunctionalComponent<RoutableProps> = ({}) => {
	return <div className="Keyboard">
		<div className="Keyboard__body">Keyboard</div>
		<Menu />
	</div>;
};
