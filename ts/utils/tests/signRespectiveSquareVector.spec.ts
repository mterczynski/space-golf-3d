import { Vector3 } from 'three';
import { signRespectiveSquareVector } from '../signRespectiveSquareVector';

describe('signRespectiveSquareVector', () => {
	test('should work', () => {
		const givenVector = new Vector3(3, -4, 5);

		const result = signRespectiveSquareVector(givenVector);

		expect(result).toEqual(new Vector3(9, -16, 25));
	});
});
