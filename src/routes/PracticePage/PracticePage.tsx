import './PracticePage.scss';
import type { FunctionalComponent } from 'preact';
import type { RoutableProps } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import { h } from 'preact';
import { Trainer } from '../../components/Trainer/Trainer';

export const PracticePage: FunctionalComponent<RoutableProps> = ({}) => {

	return <div className="PracticePage">
		<Trainer/>
		<Menu/>
	</div>
}
