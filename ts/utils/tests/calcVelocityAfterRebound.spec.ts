import { calcVelocityAfterRebound } from '../calcVelocityAfterRebound';
import { Vector3 } from 'three';

describe('calcVelocityAfterRebound', () => {
	test('case #1 - moving sphere falls vertically on a static sphere', () => {
		const staticSphere = {
			radius: 5,
			position: new Vector3(0, 0, 0)
		};

		const movingSphere = {
			radius: 3,
			position: new Vector3(0, 8, 0),
			velocity: new Vector3(0, -1, 0)
		};

		const onBounceVelocityMultiplier = 0.6;

		const expectedVelocity = new Vector3(0, 0.6, 0);

		const result = calcVelocityAfterRebound({
			staticSphere,
			movingSphere,
			onBounceVelocityMultiplier
		});

		expect(result).toEqual(expectedVelocity);
	});

	test('case #2 - moving sphere comes at 45° angle to a static sphere', () => {
		const staticSphere = {
			radius: 5,
			position: new Vector3(0, 0, 0)
		};

		const movingSphere = {
			radius: 3,
			position: new Vector3(0, 8, 0),
			velocity: new Vector3(1, -1, 0)
		};

		const onBounceVelocityMultiplier = 0.6;

		const expectedVelocity = new Vector3(1, 1, 0).multiplyScalar(onBounceVelocityMultiplier);

		const result = calcVelocityAfterRebound({
			staticSphere,
			movingSphere,
			onBounceVelocityMultiplier
		});

		expect(result).toEqual(expectedVelocity);
	});

	describe('immutability tests', () => {
		const onBounceVelocityMultiplier = 0.6;
		let staticSphere: any;
		let movingSphere: any;

		function reset() {
			staticSphere = {
				radius: 5,
				position: new Vector3(2, 3, 4)
			};

			movingSphere = {
				radius: 3,
				position: new Vector3(5, 6, 7),
				velocity: new Vector3(1, 2, 3)
			};
		}

		beforeEach(reset);

		test(`staticSphere.position shouldn't be mutated`, () => {
			calcVelocityAfterRebound({
				staticSphere,
				movingSphere,
				onBounceVelocityMultiplier
			});

			expect(staticSphere.position).toEqual(new Vector3(2, 3, 4));
		});

		test(`movingSphere.position shouldn't be mutated`, () => {
			calcVelocityAfterRebound({
				staticSphere,
				movingSphere,
				onBounceVelocityMultiplier
			});

			expect(movingSphere.position).toEqual(new Vector3(5, 6, 7));
		});

		test(`movingSphere.velocity shouldn't be mutated`, () => {
			calcVelocityAfterRebound({
				staticSphere,
				movingSphere,
				onBounceVelocityMultiplier
			});

			expect(movingSphere.velocity).toEqual(new Vector3(1, 2, 3));
		});
	});
});
