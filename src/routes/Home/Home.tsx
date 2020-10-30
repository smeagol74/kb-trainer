import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import './Home.scss';
import type { RoutableProps } from 'preact-router';
import { Trainer } from '../../components/Trainer/Trainer';

export const Home: FunctionalComponent<RoutableProps> = () => {
	return <div className="Home">
			<Trainer/>
	</div>;
};
