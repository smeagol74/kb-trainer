import './AboutPage.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { Menu } from '../../components/Menu/Menu';
import { Link } from 'preact-router';
import { url } from '../sitemap';

export const AboutPage: FunctionalComponent = () => {
	return <div className="AboutPage">
		<div className="AboutPage__body">
			About
			<Link href={url.home}>Start</Link>
		</div>
		<Menu/>
	</div>
}
