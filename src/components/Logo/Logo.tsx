import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import './Logo.scss';
import { Icon } from '../Icon/Icon';
import { useContext } from 'preact/hooks';
import { i18nContext } from '../../App';

export const Logo: FunctionalComponent = () => {
	const { _p } = useContext(i18nContext);
	return <div className="Logo">
		<Icon className="Logo__img" img="keyboard-13" />
		<div className="Loto__caption">{_p('Logo', 'kb-trainer')}</div>
	</div>;
};
