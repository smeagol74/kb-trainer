import './PracticePage.scss';
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { RoutableProps } from 'preact-router';
import { route } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import { Trainer, TrainerState } from '../../components/Trainer/Trainer';
import { url } from '../sitemap';
import { useContext, useState } from 'preact/hooks';
import { i18nContext } from '../../App';
import { useKeyboard } from '../../components/Db/effects/useKeyboard';

export interface IPracticePageProps extends RoutableProps {
	id?: string;
}

export const PracticePage: FunctionalComponent<IPracticePageProps> = ({ id }) => {
	const { _p } = useContext(i18nContext);
	const [state, setState] = useState<TrainerState>(TrainerState.NEW);
	const keyboard = useKeyboard(id);

	function _onCancelTraining() {
		route(url.keyboard(id!));
	}

	function _onRestartLesson() {
		setState(TrainerState.BETWEEN_LESSONS);
	}

	function _onPause() {
		setState(TrainerState.PAUSED);
	}

	return <div className="PracticePage">
		<div className="PracticePage__body">
			{keyboard && <Trainer {...{
				state,
				setState,
				keyboard,
			}} />}
		</div>
		<Menu>
			{TrainerState.BETWEEN_LESSONS !== state &&
			<button className="PracticePage__menu-button"
							onClick={_onCancelTraining}>{_p('PracticePage', 'Cancel Training')}</button>}
			{TrainerState.IN_LESSON === state &&
			<button className="PracticePage__menu-button"
							onClick={_onRestartLesson}>{_p('PracticePage', 'Restart Lesson')}</button>}
			{TrainerState.IN_LESSON === state &&
			<button className="PracticePage__menu-button" onClick={_onPause}>{_p('PracticePage', 'Pause')}</button>}
			{TrainerState.BETWEEN_LESSONS === state &&
			<button className="PracticePage__menu-button"
							onClick={_onCancelTraining}>{_p('PracticePage', 'Stop Training')}</button>}
		</Menu>
	</div>;
};
