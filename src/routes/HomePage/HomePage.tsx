import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import './HomePage.scss';
import { useContext } from 'preact/hooks';
import { i18nContext } from '../../App';
import { rt } from '../sitemap';
import { route } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import { Icon } from '../../components/Icon/Icon';

export const HomePage: FunctionalComponent = () => {

	const { _p } = useContext(i18nContext);

	function _onStart() {
		route(rt.user);
	}

	return <div className="HomePage">
		<div className="HomePage__body">
			<div className="HomePage__body-content">
				<h1>{_p('HomePage', 'kb-trainer')}</h1>

				<section dangerouslySetInnerHTML={{ __html: _p('HomePage', 'section_history') }} />
				<section dangerouslySetInnerHTML={{ __html: _p('HomePage', 'section_concept') }} />
				<section dangerouslySetInnerHTML={{ __html: _p('HomePage', 'section_createdFor') }} />
				<section dangerouslySetInnerHTML={{ __html: _p('HomePage', 'section_specifics') }} />
				<section dangerouslySetInnerHTML={{ __html: _p('HomePage', 'section_principles') }} />
				<section dangerouslySetInnerHTML={{ __html: _p('HomePage', 'section_howItWorks') }} />
				<section dangerouslySetInnerHTML={{ __html: _p('HomePage', 'section_congratulations') }} />
				<p className="HomePage__body-controls">
					<button className="HomePage__start-button-body" onClick={_onStart}><Icon
						img={'rocket-19'} /> {_p('HomePage', 'Start')}</button>
				</p>
				<section dangerouslySetInnerHTML={{ __html: _p('HomePage', 'section_plans') }} />
			</div>
		</div>
		<Menu>
			<button className="HomePage__start-button" onClick={_onStart}><Icon img={'rocket-19'}
																																					size={'sm'} /> {_p('HomePage', 'Start')}
			</button>
		</Menu>
	</div>;
};
