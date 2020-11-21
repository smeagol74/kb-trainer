import type { User, UserKeyboard } from '../components/Db/User';
import type { Keyboard } from '../components/Db/Keyboard';
import { DEFAULT_USER_KEYBOARD } from '../components/Db/User';

export function userKeyboard(user?: User, keyboard?: Keyboard): UserKeyboard {
	return user?.keyboards[keyboard?.id ?? 0] ?? DEFAULT_USER_KEYBOARD;
}
