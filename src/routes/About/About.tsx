import './About.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { Menu } from '../../components/Menu/Menu';
import { Link } from 'preact-router';
import { url } from '../sitemap';

export const About: FunctionalComponent = () => {
	return <div className="About">
		<div className="About__body">
			About
			<Link href={url.home}>Start</Link>
		</div>
		<Menu/>
	</div>
}
