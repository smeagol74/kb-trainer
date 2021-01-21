import type { Keyboard } from '../Db/Keyboard';
import { useEffect, useState } from 'preact/hooks';
import { KeyboardCalc } from '../Db/Keyboard';
import { Db } from '../Db/Db';
import _ from 'lodash';

export function useCharKeyboardMapFor(keyboard: Keyboard): Dict<string> {
	const [map, setMap] = useState<Dict<string>>({});

	useEffect(() => {
		if (keyboard) {
			const keyboardIds = KeyboardCalc.keyboards(keyboard);
			if (keyboardIds.length > 1) {
				const promises = _.map(keyboardIds, id => Db.keyboard.get(id));
				Promise.all(promises).then(keyboards => {
					const res: Dict<string> = {};
					_.each(keyboards, keyboard => {
						_(keyboard?.keys).each(key => {
							res[key] = keyboard!.id;
						});
					});
					setMap(res);
				});
			} else {
				setMap({});
			}
		}
	}, [keyboard, setMap]);

	return map;
}
