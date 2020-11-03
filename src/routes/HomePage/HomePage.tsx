import type { FunctionalComponent, Key } from 'preact';
import { h } from 'preact';
import './HomePage.scss';
import type { RoutableProps } from 'preact-router';
import { Menu } from '../../components/Menu/Menu';
import type { Keyboard } from '../../components/Db/Keyboard';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Db } from '../../components/Db/Db';
import { UserContext } from '../../App';
import _ from 'lodash';
import { MyKeyboard } from './MyKeyboard';
import { OtherKeyboard } from './OtherKeyboard';

export const HomePage: FunctionalComponent<RoutableProps> = () => {

	const [myKeyboards, setMyKeyboards] = useState<Keyboard[]>([]);
	const [otherKeyboards, setOtherKeyboards] = useState<Keyboard[]>([]);

	const { user } = useContext(UserContext);

	useEffect(() => {

		function _queryCounts(keyboards: Keyboard[]) {
			const promises: PromiseLike<number | Keyboard[]>[] = _(keyboards).map(kb => Db.progress.where({
				user: user?.id,
				keyboard: kb.id,
			}).count())
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
			.then(_queryCounts)
			.then(_splitKeyboards)
			.then(_saveToState);
	}, [user, setMyKeyboards, setOtherKeyboards]);


	return <div className="HomePage">
		<div className="HomePage__body">
			<div className="HomePage__frame">
				{!_.isEmpty(myKeyboards) && <div className="HomePage__my-keyboards">
					<h3>My keyboards progress</h3>
					{_.map(myKeyboards, (keyboard, idx) => <MyKeyboard {...{
						key: idx,
						keyboard,
					}} />)}
				</div>}
				{!_.isEmpty(otherKeyboards) && <div className="HomePage__other-keyboards">
					<h3>Available keyboards</h3>
					{_.map(otherKeyboards, (keyboard, idx) => <OtherKeyboard {...{
						key: idx,
						keyboard,
					}} />)}
				</div>}
			</div>
		</div>
		<Menu />
	</div>;
};
