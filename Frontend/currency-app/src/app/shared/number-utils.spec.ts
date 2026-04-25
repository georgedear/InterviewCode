import { roundNumber } from './number-utils';

describe('roundNumber', () => {

    it('should round to the specified number of decimal places', () => {
        expect(roundNumber(1.2345, 2)).toBe(1.23);
    });

    it('should round up when the next digit is 5 or above', () => {
        expect(roundNumber(1.235, 2)).toBe(1.24);
    });

    it('should round down when the next digit is below 5', () => {
        expect(roundNumber(1.234, 2)).toBe(1.23);
    });

    it('should handle 0 decimal places', () => {
        expect(roundNumber(1.6, 0)).toBe(2);
        expect(roundNumber(1.4, 0)).toBe(1);
    });

    it('should handle whole numbers', () => {
        expect(roundNumber(5, 2)).toBe(5);
    });

    it('should handle negative numbers', () => {
        expect(roundNumber(-1.235, 2)).toBe(-1.24);
        expect(roundNumber(-1.234, 2)).toBe(-1.23);
    });

    it('should handle zero', () => {
        expect(roundNumber(0, 2)).toBe(0);
    });

    it('should handle large numbers', () => {
        expect(roundNumber(123456.789, 2)).toBe(123456.79);
    });

    it('should handle a high number of decimal places', () => {
        expect(roundNumber(1.123456789, 5)).toBe(1.12346);
    });
});