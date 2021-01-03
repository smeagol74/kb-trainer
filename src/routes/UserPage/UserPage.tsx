import type { FunctionalComponent, Key } from 'preact';
import { h } from 'preact';
import './UserPage.scss';
import type { RoutableProps } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import type { Keyboard } from '../../components/Db/Keyboard';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Db } from '../../components/Db/Db';
import { i18nContext, UserContext } from '../../App';
import _ from 'lodash';
import { MyKeyboard } from './MyKeyboard';
import { OtherKeyboard } from './OtherKeyboard';
import { KeyboardCalc } from '../../components/Db/Keyboard';

export const UserPage: FunctionalComponent<RoutableProps> = () => {

	const [myKeyboards, setMyKeyboards] = useState<Keyboard[]>([]);
	const [otherKeyboards, setOtherKeyboards] = useState<Keyboard[]>([]);

	const { user } = useContext(UserContext);
	const { _p } = useContext(i18nContext);

	useEffect(() => {

		function _fetchPrerequisites(keyboards: Keyboard[]): PromiseLike<Keyboard[]> {
			const promises = _.map(keyboards, k => Db.utils.keyboard.withDetails(k));
			return Promise.all(promises);
		}

		function _queryKeyboardCounts(keyboard: Keyboard) {
			const keyboards = KeyboardCalc.keyboards(keyboard);
			return Promise.all(_.map(keyboards, kb => Db.progress.where({
				user: user?.id,
				keyboard: kb,
			}).count()))
				.then(_.sum);
		}

		function _queryCounts(keyboards: Keyboard[]) {
			const promises: PromiseLike<number | Keyboard[]>[] = _(keyboards).map(_queryKeyboardCounts)
				.value();
			return Promise.all([
				Promise.resolve(keyboards),
				...promises,
			]);
		}

		function _splitKeyboards(res: (Keyboard[] | number)[]) {
			const keyboards = res[0] as Keyboard[];
			const counts = _.filter(res, v => Number.isInteger(v));

			const my: Keyboard[] = [];
			const other: Keyboard[] = [];

			_.each(keyboards, (keyboard, idx) => {
				if (counts[idx] > 0) {
					my.push(keyboard);
				} else {
					other.push(keyboard);
				}
			});
			return {
				my,
				other,
			};
		}

		function _saveToState({ my, other }: { my: Keyboard[], other: Keyboard[] }) {
			setMyKeyboards(my);
			setOtherKeyboards(other);
		}

		Db.keyboard.toArray()
			.then(_fetchPrerequisites)
			.then(_queryCounts)
			.then(_splitKeyboards)
			.then(_saveToState);
	}, [user, setMyKeyboards, setOtherKeyboards]);


	return <div className="UserPage">
		<div className="UserPage__body">
			<div className="UserPage__frame">
				<h1>{_p('KeyboardPage', 'Welcome, %1', user?.name)}</h1>
				{!_.isEmpty(myKeyboards) && <div className="UserPage__my-keyboards">
					<h3>{_p('UserPage', 'My keyboards progress')}</h3>
					<div className="UserPage__group-list">
						{_.map(myKeyboards, (keyboard, idx) => <MyKeyboard {...{
							key: idx,
							className: 'UserPage__group-list-item',
							keyboard,
						}} />)}
					</div>
				</div>}
				{!_.isEmpty(otherKeyboards) && <div className="UserPage__other-keyboards">
					<h3>{_p('UserPage', 'Available keyboards')}</h3>
					<div className="UserPage__group-list">
						{_.map(otherKeyboards, (keyboard, idx) => <OtherKeyboard {...{
							key: idx,
							className: 'UserPage__group-list-item',
							keyboard,
						}} />)}
					</div>
				</div>}
			</div>
		</div>
		<Menu />
	</div>;
};
