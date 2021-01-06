import { useEffect, useState } from 'preact/hooks';
import type { Keyboard } from '../Keyboard';
import _ from 'lodash';
import { Db } from '../Db';

export function useKeyboard(id?: string): Keyboard | undefined {

	const [keyboard, setKeyboard] = useState<Keyboard | undefined>(undefined);

	useEffect(() => {
		if (!_.isEmpty(id)) {
			Db.utils.keyboard.get(id!)
				.then(setKeyboard);
		}
	}, [id, setKeyboard]);

	return keyboard;
}
