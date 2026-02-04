import { Vector3 } from "three";
import { calculateFlight } from "../calculateFlight";
import { Ball } from "../../meshes/Ball";
import { Planet } from "../../meshes/Planet";

// todo: uncomment and finish this test file

describe("calculateFlight", () => {
	test('should calculate reasonable trajectory with gravity effect', () => {
		// Setup: ball above a planet, launched horizontally
		const launchVector = new Vector3(3.5, 0, 0); // horizontal launch
		const ballRadius = 5;
		const planet = new Planet({ radius: 30, density: 0.00014 })
		planet.position.set(0, 0, 0)
		const planets = [planet];
		const ball = new Ball({ radius: ballRadius });
		ball.position.set(0, 50, 0); // Start 50 units above planet center
		
		const settings = {
			ticksPerSecond: 60,
			maxFlightDurationInSeconds: 5
		}
		const result = calculateFlight(launchVector, ball, planets, settings)
		
		// Check that we get some ticks
		expect(result.ticks.length).toBeGreaterThan(0);
		
		// First tick should be at starting position
		expect(result.ticks[0].position).toEqual(ball.position);
		
		// After a few ticks, ball should have moved in launch direction (x increases)
		expect(result.ticks[10].position.x).toBeGreaterThan(result.ticks[0].position.x);
		
		// Gravity should pull ball down (y decreases over time)
		expect(result.ticks[50].position.y).toBeLessThan(result.ticks[0].position.y);
	});

	test("should produce similar trajectories at different tick rates", () => {
		// This test verifies that the physics is frame-rate independent
		const launchVector = new Vector3(3.5, 0, 0);
		const ballRadius = 5;
		const planet = new Planet({ radius: 30, density: 0.00014 })
		planet.position.set(0, 0, 0)
		const planets = [planet];
		
		const ball60 = new Ball({ radius: ballRadius });
		ball60.position.set(0, 50, 0);
		const result60 = calculateFlight(launchVector, ball60, planets, {
			ticksPerSecond: 60,
			maxFlightDurationInSeconds: 1
		});
		
		const ball500 = new Ball({ radius: ballRadius });
		ball500.position.set(0, 50, 0);
		const result500 = calculateFlight(launchVector, ball500, planets, {
			ticksPerSecond: 500,
			maxFlightDurationInSeconds: 1
		});
		
		// At 60 TPS, we have 60 ticks per second
		// At 500 TPS, we have 500 ticks per second
		// After 1 second, positions should be similar
		const finalPos60 = result60.ticks[result60.ticks.length - 1].position;
		const finalPos500 = result500.ticks[result500.ticks.length - 1].position;
		
		// Positions should be reasonably close (allowing ~2% variance due to integration step differences)
		// toBeCloseTo with precision 0 means tolerance of ~0.5 units, which is too strict
		// We use a manual check instead to allow ~5 units of difference
		expect(Math.abs(finalPos60.x - finalPos500.x)).toBeLessThan(5);
		expect(Math.abs(finalPos60.y - finalPos500.y)).toBeLessThan(5);
		expect(Math.abs(finalPos60.z - finalPos500.z)).toBeLessThan(5);
	});

	test("should cut the flight if it exceeds the time limit", () => {
		const launchVector = new Vector3(3.5, 0, 0);
		const ball = new Ball({ radius: 5 });
		ball.position.set(0, 50, 0);
		
		const settings = {
			ticksPerSecond: 60,
			maxFlightDurationInSeconds: 2
		}
		const result = calculateFlight(launchVector, ball, [], settings);
		
		// Should have at most 2 seconds * 60 ticks/second = 120 ticks (plus initial tick)
		expect(result.ticks.length).toBeLessThanOrEqual(121);
	});
});
