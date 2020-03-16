import { calcGravityForce } from '../calcGravityForce';
import { Vector3 } from 'three';

describe('calcGravityForce', () => {
	test(`calcGravityForce shouldn't mutate puller's position`, () => {
		const puller = {mass: 30, position: new Vector3(4, 0, 0)};
		const pulled = {mass: 2, position: new Vector3(20, 0, 0)};

		calcGravityForce({
			pulled,
			puller
		});

		expect(puller.position).toEqual(new Vector3(4, 0, 0));
	});

	test(`calcGravityForce shouldn't mutate pulled's position`, () => {
		const puller = {mass: 30, position: new Vector3(4, 0, 0)};
		const pulled = {mass: 2, position: new Vector3(20, 0, 0)};

		calcGravityForce({
			pulled,
			puller
		});

		expect(pulled.position).toEqual(new Vector3(20, 0, 0));
	});

	test(`scenario #1: objects are placed on x axis'`, () => {
		const mockPlanet = {mass: 30, position: new Vector3(4, 0, 0)};
		const mockBall = {mass: 2, position: new Vector3(20, 0, 0)};

		const distance = 16;

		const result = calcGravityForce({
			pulled: mockBall,
			puller: mockPlanet
		});

		const expected = new Vector3(
			-60 / (distance ** 2),
			0,
			0
		);

		expect(result).toEqual(expected);
	});

	test('scenario #2" objects have non-zero x, y, z values - simple version', () => {
		const puller = {mass: 3, position: new Vector3(2, 2, 2)};
		const pulled = {mass: 2, position: new Vector3(10, 10, 10)};

		const distance = pulled.position.distanceTo(puller.position);

		const result = calcGravityForce({
			pulled,
			puller
		});

		const normalizedDirVector = new Vector3(-1, -1, -1).normalize();
		const expectedForce = normalizedDirVector.clone().multiplyScalar(puller.mass * pulled.mass / distance ** 2);

		expect(result).toEqual(expectedForce);
	});

	test('scenario #3" objects have non-zero x, y, z values - advanced version', () => {
		const puller = {mass: 3, position: new Vector3(1, 2, 3)};
		const pulled = {mass: 2, position: new Vector3(15, 16, 17)};

		const distance = pulled.position.distanceTo(puller.position);

		const result = calcGravityForce({
			pulled,
			puller
		});

		const normalizedDirVector = new Vector3(-1, -1, -1).normalize();
		const expectedForce = normalizedDirVector.clone().multiplyScalar(puller.mass * pulled.mass / distance ** 2);

		expect(result.x).toBeCloseTo(expectedForce.x);
		expect(result.y).toBeCloseTo(expectedForce.y);
		expect(result.z).toBeCloseTo(expectedForce.z);
	});
});
