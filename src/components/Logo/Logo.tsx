import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import './Logo.scss';
import { Icon } from '../Icon/Icon';

export const Logo: FunctionalComponent = () => {
	return <div className="Logo">
		<Icon className="Logo__img" img="keyboard-13"/>
		<div className="Loto__caption">kb-trainer</div>
	</div>;
}
