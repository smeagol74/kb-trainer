import './KeyboardPage.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { RoutableProps } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';

export const KeyboardPage: FunctionalComponent<RoutableProps> = ({}) => {
	return <div className="KeyboardPage">
		<div className="KeyboardPage__body">Keyboard</div>
		<Menu />
	</div>;
};
