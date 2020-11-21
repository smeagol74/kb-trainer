import { sumMerge } from './stats';

describe('utils', function() {
	describe('sumMerge', () => {
		it('should modify destination', () => {
			const dest: Dict<number> = {
				'1': 1,
				'2': 2,
			};
			const src: Dict<number> = {
				'2': 1,
				'3': 2,
			};
			sumMerge(dest, src);
			expect(dest).toEqual({
				'1': 1,
				'2': 3,
				'3': 2,
			});
		});
	});
});
