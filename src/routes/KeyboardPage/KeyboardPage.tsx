import './KeyboardPage.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { RoutableProps } from 'preact-router';
import { route } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import { Icon } from '../../components/Icon/Icon';
import type { Keyboard } from '../../components/Db/Keyboard';
import { useContext, useEffect, useState } from 'preact/hooks';
import { i18nContext, UserContext } from '../../App';
import { Db } from '../../components/Db/Db';
import _ from 'lodash';
import { OtherKeyboard } from '../UserPage/OtherKeyboard';
import { url } from '../sitemap';

export interface IKeyboardPageProps extends RoutableProps {
	id?: string;
}


export const KeyboardPage: FunctionalComponent<IKeyboardPageProps> = ({ id }) => {

	const { _p } = useContext(i18nContext);
	const [keyboard, setKeyboard] = useState<Keyboard | undefined>(undefined);
	const { user } = useContext(UserContext);
	const [haveStats, setHaveStats] = useState<boolean>(false);

	useEffect(() => {
		if (!_.isEmpty(id)) {
			Db.keyboard.get(id!)
				.then(setKeyboard);
		}
	}, [id, setKeyboard]);

	useEffect(() => {
		if (!_.isEmpty(id)) {
			Db.progress.where({
				user: user?.id,
				keyboard: id,
			}).count()
				.then(c => setHaveStats(c > 0));
		}
	}, [id, user, setHaveStats]);

	function _onStart() {
		route(url.practice(id!));
	}

	function _onStats() {
		route(url.stats(id!));
	}

	return <div className="KeyboardPage">
		<div className="KeyboardPage__body">
			<div className="KeyboardPage__box">
				{!_.isNil(keyboard) && <OtherKeyboard keyboard={keyboard} className="KeyboardPage__header" />}
				<div className="KeyboardPage__details">
					<div className="KeyboardPage__details-view">
						{_.map(keyboard?.lessons, (s, idx) => <div key={idx}>
							<strong>Lesson {idx + 1}:</strong>
							{_.map(s, (k, kidx) => <kbd key={`${idx}-${kidx}`}>{k}</kbd>)}
						</div>)}
					</div>
					{haveStats && <div className="KeyboardPage__details-controls">
						<button className="KeyboardPage__stats-button" onClick={_onStats}><Icon
							img="chart-5" /> {_p('KeyboardPage', 'More Stats')}</button>
					</div>}
				</div>
				<div className="KeyboardPage__options">
					<div className="KeyboardPage__options-form"></div>
					<div className="KeyboardPage__options-controls">
						<button className="KeyboardPage__start-button" onClick={_onStart}><Icon
							img="rocket-19" /> {_p('KeyboardPage', 'Start Training')}
						</button>
					</div>
				</div>
			</div>
		</div>
		<Menu />
	</div>;
};
