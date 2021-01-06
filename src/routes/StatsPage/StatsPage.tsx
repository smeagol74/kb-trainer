import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { h } from 'preact';
import { Menu } from '../../components/Menu/Menu';
import { StatsChart } from './StatsChart';
import './StatsPage.scss';
import type { RoutableProps } from 'preact-router';
import { route } from 'preact-router';
import { url } from '../sitemap';
import { useContext } from 'preact/hooks';
import { i18nContext, UserContext } from '../../App';
import { useUserKeyboardStats } from '../../components/Trainer/useUserKeyboardStats';
import { useKeyboard } from '../../components/Db/effects/useKeyboard';
import { KeyboardCalc } from '../../components/Db/Keyboard';
import _ from 'lodash';
import { userKeyboard } from '../../utils/user';
import { keyStrokesWithErrors, StudyStats } from '../../components/Trainer/StudyStats';

interface IStatsPageProps extends RoutableProps {
	className?: string;
	id?: string;
}

function _extendStats(keys: string[], values?: Dict<number>): Dict<number> {
	const result: Dict<number> = {};
	_.each(keys, (key) => {
		const v = values?.[key] ?? 0;
		result[key] = v;
	});
	return result;
}

function _normalizeStrokes(strokes?: Dict<number>, errors?: Dict<number>, extraStrokes?: number): Dict<number> {
	const result: Dict<number> = {};
	const stats: StudyStats = {
		strokes: strokes ?? {},
		errors: errors ?? {},
	};
	_(strokes).keys().each((key) => {
		result[key] = keyStrokesWithErrors(stats, extraStrokes ?? 0, key);
	});
	return result;
}

export const StatsPage: FunctionComponent<IStatsPageProps> = ({ className, id }) => {
	const { _p } = useContext(i18nContext);
	const keyboard = useKeyboard(id);
	const { user } = useContext(UserContext);
	const [stats] = useUserKeyboardStats(user, keyboard);

	const uKey = userKeyboard(user, keyboard);
	const keys = KeyboardCalc.keys(keyboard) ?? [];
	const errors = _extendStats(keys, stats?.errors ?? {});
	const strokes = _extendStats(keys, _normalizeStrokes(stats?.strokes, stats?.errors, uKey.error.extraStrokes));

	const showChart = !(_.isEmpty(keys) || _.isEmpty(strokes) || _(strokes).values().sum() === 0);

	function _onReturn() {
		route(url.keyboard(id!));
	}

	return <div className={clsx('StatsPage', className)}>
		<div className={'StatsPage__body'}>
			{showChart && <StatsChart strokes={strokes} errors={errors} />}
		</div>
		<Menu>
			<button className="StatsPage__menu-button"
							onClick={_onReturn}>{_p('StatsPage', 'Back to Keyboard')}</button>
		</Menu>

	</div>;
};
