import Dexie from 'dexie';
import type { Keyboard } from './Keyboard';
import type { Progress } from './Progress';
import type { User } from './User';

import { en } from './keyboards/en';
import { punct_en } from './keyboards/punct_en';
import { ru } from './keyboards/ru';
import { punct_ru } from './keyboards/punct_ru';
import { specials } from './keyboards/specials';
import { numbers } from './keyboards/numbers';
import { func } from './keyboards/func';
import { pack_ru } from './keyboards/pack_ru';
import { pack_en } from './keyboards/pack_en';
import _ from 'lodash';

class DexieDb extends Dexie {

	keyboard: Dexie.Table<Keyboard, string>;
	user: Dexie.Table<User, string>;
	progress: Dexie.Table<Progress, number>;

	utils: {
		keyboard: {
			withDetails: (keyboard: Keyboard) => PromiseLike<Keyboard>;
			get: (id: string) => PromiseLike<Keyboard | undefined>;
		}
	};


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

		const self = this;

		this.utils = {
			keyboard: {
				withDetails(keyboard: Keyboard): PromiseLike<Keyboard> {
					if (_.isEmpty(keyboard.keyboards)) {
						return Promise.resolve(keyboard);
					} else {
						return Promise.all(_.map(keyboard.keyboards, id => self.keyboard.get(id)))
							.then(keyboards => {
								return {
									...keyboard,
									keys: [
										..._(keyboards).map('keys').flatten().value(),
										...keyboard.keys,
									],
								};
							});
					}
				},
				get(id: string): PromiseLike<Keyboard | undefined> {
					return Db.keyboard.get(id).then(keyboard => {
						if (_.isNil(keyboard)) {
							return keyboard;
						} else {
							return self.utils.keyboard.withDetails(keyboard);
						}
					});
				},
			},
		};
	}

	loadDefaults() {
		return Db.keyboard.bulkPut([
			en,
			punct_en,
			ru,
			punct_ru,
			specials,
			numbers,
			func,
			pack_en,
			pack_ru,
		]);
	}

}

export const Db = new DexieDb();
