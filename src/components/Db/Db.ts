import Dexie from 'dexie';
import type { Keyboard } from './Keyboard';
import type { Progress } from './Progress';
import type { User } from './User';

import { en } from './keyboards/en';
import { punct_en } from './keyboards/punct_en';
import { ru } from './keyboards/ru';
import { punct_ru } from './keyboards/punct_ru';
import { specials_mac } from './keyboards/specials_mac';
import { numbers } from './keyboards/numbers';
import { func } from './keyboards/func';

class DexieDb extends Dexie {

	keyboard: Dexie.Table<Keyboard, string>;
	user: Dexie.Table<User, string>;
	progress: Dexie.Table<Progress, number>;


	constructor() {
		super('kb-trainer');
		this.version(1).stores({
			keyboard: 'id',
			user: 'id',
			progress: '++id, [user+keyboard]',
		});
		this.keyboard = this.table('keyboard');
		this.user = this.table('user');
		this.progress = this.table('progress');
	}

	loadDefaults() {
		return Db.keyboard.bulkPut([
			en,
			punct_en,
			ru,
			punct_ru,
			specials_mac,
			numbers,
			func,
		]);
	}

}

export const Db = new DexieDb();
