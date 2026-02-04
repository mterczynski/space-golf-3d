import { Vector3 } from "three";
import { areSpheresColliding, isBallCollidingWithPlanet } from "../sphereCollisions";

describe("sphere collision utils", () => {
	describe("areSpheresColliding", () => {
		test("should return true if spheres are intersecting", () => {
			const sphere1 = {
				position: new Vector3(0, 0, 0),
				radius: 3,
			};

			const sphere2 = {
				position: new Vector3(4, 0, 0),
				radius: 2,
			};

			const result = areSpheresColliding(sphere1, sphere2);

			expect(result).toEqual(true);
		});

		test("should return true if spheres are barely touching each other", () => {
			const sphere1 = {
				position: new Vector3(0, 0, 0),
				radius: 3,
			};

			const sphere2 = {
				position: new Vector3(5, 0, 0),
				radius: 2,
			};

			const result = areSpheresColliding(sphere1, sphere2);

			expect(result).toEqual(true);
		});

		test("should return false if spheres are not colliding", () => {
			const sphere1 = {
				position: new Vector3(0, 0, 0),
				radius: 2,
			};

			const sphere2 = {
				position: new Vector3(0, 10, 0),
				radius: 2,
			};

			const result = areSpheresColliding(sphere1, sphere2);

			expect(result).toEqual(false);
		});
	});

	describe("isBallCollidingWithPlanet", () => {
		test("no collision scenario", () => {
			const ball = {
				position: new Vector3(0, 0, 0),
				radius: 2,
			};

			const planet = {
				position: new Vector3(0, 10, 0),
				radius: 2,
			};

			expect(isBallCollidingWithPlanet(ball, planet)).toEqual(false);
		});

		test("collision scenario - one point of touch", () => {
			const ball = {
				position: new Vector3(0, 0, 0),
				radius: 2,
			};

			const planet = {
				position: new Vector3(0, 5, 0),
				radius: 3,
			};

			expect(isBallCollidingWithPlanet(ball, planet)).toEqual(true);
		});

		test("collision scenario - intersection", () => {
			const ball = {
				position: new Vector3(0, 0, 0),
				radius: 2,
			};

			const planet = {
				position: new Vector3(0, 4, 0),
				radius: 3,
			};

			expect(isBallCollidingWithPlanet(ball, planet)).toEqual(true);
		});
	});
});
