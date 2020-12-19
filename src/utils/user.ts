import type { User, UserKeyboard } from '../components/Db/User';
import type { Keyboard } from '../components/Db/Keyboard';
import { DEFAULT_USER_KEYBOARD } from '../components/Db/User';
import _ from 'lodash';

export function userKeyboard(user?: User, keyboard?: Keyboard): UserKeyboard {
	const uKey = user?.keyboards[keyboard?.id ?? 0] ?? DEFAULT_USER_KEYBOARD;
	return _.merge({}, DEFAULT_USER_KEYBOARD, uKey);
}
