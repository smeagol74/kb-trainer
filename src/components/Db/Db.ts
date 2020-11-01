import { DBSchema, openDB } from 'idb';
import type { Keyboard } from './Keyboard';
import type { User } from './User';
import type { Progress } from './Progress';
import { adv_en } from './Init/adv_en';
import { adv_punct_en } from './Init/adv_punct_en';
import { adv_ru } from './Init/adv_ru';
import { adv_punct_ru } from './Init/adv_punct_ru';
import { adv_specials } from './Init/adv_specials';

export type Stores = 'keyboard' | 'use' | 'progress';

interface DB extends DBSchema {
	keyboard: {
		key: string,
		value: Keyboard
	},
	user: {
		key: string,
		value: User
	},
	progress: {
		key: number,
		value: Progress
	}
}


const db = openDB<DB>('kb-trainer', 1, {
	async upgrade(db, oldVersion) {
		if (oldVersion < 1) {
			db.createObjectStore('keyboard', {
				keyPath: 'id',
			});
			db.createObjectStore('user', {
				keyPath: 'id',
			});
			db.createObjectStore('progress', {
				keyPath: 'id',
				autoIncrement: true,
			});
		}

	},
});

async function _loadKeyboard(key: string, data: Keyboard) {
	return db.then(d => d.put('keyboard', data));
}

const keyboard = {
	async loadDefaults() {
		await _loadKeyboard(adv_en.id, adv_en);
		await _loadKeyboard(adv_punct_en.id, adv_punct_en);
		await _loadKeyboard(adv_ru.id, adv_ru);
		await _loadKeyboard(adv_punct_ru.id, adv_punct_ru);
		await _loadKeyboard(adv_specials.id, adv_specials);
	},
};

const user = {
	async list() {
		return db.then(d => d.getAll('user'));
	},
	async put(user: User) {
		return db.then(d => d.put('user', user));
	}
};

const progress = {};

export const Db = {
	keyboard,
	user,
	progress,
};
