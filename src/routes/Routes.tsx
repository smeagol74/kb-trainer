import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { Router } from 'preact-router';
import { Home } from './Home/Home';


export interface IRoutesProps {
}

export const Routes: FunctionalComponent<IRoutesProps> = () => {
	return (<Router>
		<Home path="/"/>
	</Router>)
}
