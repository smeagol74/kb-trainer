import Dexie from 'dexie';
import type { Keyboard } from './Keyboard';
import type { Progress } from './Progress';
import type { User } from './User';

import { adv_en } from './Init/adv_en';
import { adv_punct_en } from './Init/adv_punct_en';
import { adv_ru } from './Init/adv_ru';
import { adv_punct_ru } from './Init/adv_punct_ru';
import { adv_specials } from './Init/adv_specials';
import { adv_numbers } from './Init/adv_numbers';

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
			adv_en,
			adv_punct_en,
			adv_ru,
			adv_punct_ru,
			adv_specials,
			adv_numbers
		]);
	}

}

export const Db = new DexieDb();
