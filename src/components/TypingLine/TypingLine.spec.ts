import { _isShifted } from './TypingLine';

describe('TypingLine', () => {
	describe('_isShifted', () => {
		it('letters', () => {
			expect(_isShifted('a')).toBeFalsy();
			expect(_isShifted('d')).toBeFalsy();
			expect(_isShifted('A')).toBeTruthy();
			expect(_isShifted('в')).toBeFalsy();
			expect(_isShifted('Ы')).toBeTruthy();
		});
		it('numbers', () => {
			expect(_isShifted('2')).toBeFalsy();
			expect(_isShifted('6')).toBeFalsy();
		});
		it('specials', () => {
			expect(_isShifted(':')).toBeFalsy();
			expect(_isShifted('[')).toBeFalsy();
		})
	});
});
