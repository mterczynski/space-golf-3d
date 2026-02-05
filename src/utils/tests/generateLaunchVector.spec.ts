import { Vector3 } from "three";
import { generateLaunchVector } from "../generateLaunchVector";
import { Ball } from "../../meshes/Ball";
import { Planet } from "../../meshes/Planet";

describe("generateLaunchVector", () => {
	test("launch vector should point away from the planet (positive dot product with outward normal)", () => {
		const ball = new Ball({ radius: 8 });
		ball.position.set(100, 0, 0);
		
		const planet = new Planet({ radius: 50, color: "rgb(255,0,0)" });
		planet.position.set(0, 0, 0);
		
		// Generate multiple launch vectors to test randomness
		for (let i = 0; i < 100; i++) {
			const launchVector = generateLaunchVector(ball, planet);
			const outwardNormal = ball.position.clone().sub(planet.position).normalize();
			const dotProduct = launchVector.dot(outwardNormal);
			
			// The dot product should be >= 0, meaning the launch vector points away from the planet
			expect(dotProduct).toBeGreaterThanOrEqual(0);
		}
	});
	
	test("launch vector should be normalized", () => {
		const ball = new Ball({ radius: 8 });
		ball.position.set(50, 50, 50);
		
		const planet = new Planet({ radius: 30, color: "rgb(255,0,0)" });
		planet.position.set(0, 0, 0);
		
		const launchVector = generateLaunchVector(ball, planet);
		
		// The length should be approximately 1 (normalized)
		expect(launchVector.length()).toBeCloseTo(1, 5);
	});
	
	test("launch vector should work with ball at different positions", () => {
		const positions = [
			new Vector3(100, 0, 0),
			new Vector3(0, 100, 0),
			new Vector3(0, 0, 100),
			new Vector3(50, 50, 50),
			new Vector3(-100, 0, 0),
			new Vector3(0, -100, 0),
		];
		
		const planet = new Planet({ radius: 50, color: "rgb(255,0,0)" });
		planet.position.set(0, 0, 0);
		
		positions.forEach((position) => {
			const ball = new Ball({ radius: 8 });
			ball.position.copy(position);
			
			const launchVector = generateLaunchVector(ball, planet);
			const outwardNormal = ball.position.clone().sub(planet.position).normalize();
			const dotProduct = launchVector.dot(outwardNormal);
			
			expect(dotProduct).toBeGreaterThanOrEqual(0);
			expect(launchVector.length()).toBeCloseTo(1, 5);
		});
	});
	
	test("launch vector should never point towards the planet center", () => {
		const ball = new Ball({ radius: 8 });
		ball.position.set(100, 50, 75);
		
		const planet = new Planet({ radius: 50, color: "rgb(255,0,0)" });
		planet.position.set(0, 0, 0);
		
		// Test many random vectors
		for (let i = 0; i < 1000; i++) {
			const launchVector = generateLaunchVector(ball, planet);
			
			// Calculate the direction from ball to planet (inward direction)
			const inwardDirection = planet.position.clone().sub(ball.position).normalize();
			
			// The launch vector should not be aligned with the inward direction
			// (dot product should not be close to 1)
			const dotWithInward = launchVector.dot(inwardDirection);
			
			// Should be <= 0 (pointing away or perpendicular, not towards)
			expect(dotWithInward).toBeLessThanOrEqual(0);
		}
	});
});
