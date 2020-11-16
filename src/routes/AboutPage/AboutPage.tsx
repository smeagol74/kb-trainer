import './AboutPage.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { Menu } from '../../components/Menu/Menu';
import { Link } from 'preact-router';
import { url } from '../sitemap';
import { useContext } from 'preact/hooks';
import { i18nContext } from '../../App';

export const AboutPage: FunctionalComponent = () => {

	const { _p } = useContext(i18nContext);

	return <div className="AboutPage">
		<div className="AboutPage__body">
			<p>Here is some motivation text about the project!</p>
			<Link href={url.home} className="dark-button">{_p('AboutPage', 'Start')}</Link>
		</div>
		<Menu />
	</div>;
};
