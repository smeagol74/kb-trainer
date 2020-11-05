import { _sumMerge } from './StudyCourse';

describe('StudyCourse', function() {
	describe('_sumMerge', () => {
		it('should modify destination', () => {
			const dest: Dict<number> = {
				'1': 1,
				'2': 2,
			};
			const src: Dict<number> = {
				'2': 1,
				'3': 2,
			};
			_sumMerge(dest, src);
			expect(dest).toEqual({
				'1': 1,
				'2': 3,
				'3': 2,
			});
		});
	});
});
