import { Vector3 } from "three";
import { calculateFlight } from "../calculateFlight";
import { Ball } from "../../meshes/Ball";
import { Planet } from "../../meshes/Planet";

// todo: uncomment and finish this test file

describe("calculateFlight", () => {
	// test('should calculate the flight ahead', () => {
	// 	const launchVector = new Vector3(0, 10, 0);
	// 	const ballRadius = 5;
	// 	const planet = new Planet({ radius: 30, density: 1 })
	// 	planet.position.set(0, 50, 0)
	// 	const planets = [planet];
	// 	const ball = new Ball({ radius: ballRadius, planets });
	// 	const settings = {
	// 		ticksPerSecond: 10,
	// 		maxFlightDurationInSeconds: 30
	// 	}
	// 	const result = calculateFlight(launchVector, ball, planets, settings)
	// 	const expectedTicks = [];
	// 	const expectedTicksWithCollisions = [];

	// 	expect(result.ticks).toEqual(expectedTicks);
	// 	expect(result.ticksWithCollisions).toEqual(expectedTicksWithCollisions);
	// });

	test("should cut the flight if it exceeds the time limit", () => {
		// todo
	});
});
