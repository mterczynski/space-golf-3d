import { Vector3 } from "three";
import { generateLaunchVector } from "../generateLaunchVector";
import { Ball } from "../../meshes/Ball";
import { Planet } from "../../meshes/Planet";

describe("generateLaunchVector", () => {
	test("launch vector with angle=0 should be exactly the outward normal (vertical launch)", () => {
		const ball = new Ball({ radius: 8 });
		ball.position.set(100, 0, 0);
		
		const planet = new Planet({ radius: 50, color: "rgb(255,0,0)" });
		planet.position.set(0, 0, 0);
		
		// With angle = 0, should always return the outward normal
		const outwardNormal = ball.position.clone().sub(planet.position).normalize();
		
		for (let i = 0; i < 10; i++) {
			const launchVector = generateLaunchVector(ball, planet, 0);
			
			// Should be exactly equal to outward normal
			expect(launchVector.x).toBeCloseTo(outwardNormal.x, 10);
			expect(launchVector.y).toBeCloseTo(outwardNormal.y, 10);
			expect(launchVector.z).toBeCloseTo(outwardNormal.z, 10);
		}
	});
	
	test("launch vector with default angle (Math.PI) should point away from the planet", () => {
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
	
	test("launch vector with Math.PI/2 should be within 90 degrees of outward normal", () => {
		const ball = new Ball({ radius: 8 });
		ball.position.set(100, 0, 0);
		
		const planet = new Planet({ radius: 50, color: "rgb(255,0,0)" });
		planet.position.set(0, 0, 0);
		
		const maxAngle = Math.PI / 2;
		const outwardNormal = ball.position.clone().sub(planet.position).normalize();
		
		for (let i = 0; i < 100; i++) {
			const launchVector = generateLaunchVector(ball, planet, maxAngle);
			const dotProduct = launchVector.dot(outwardNormal);
			const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
			
			// Angle should be less than or equal to maxAngle
			expect(angle).toBeLessThanOrEqual(maxAngle + 0.0001); // Small tolerance for floating point
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
	
	test("launch vector with small angle should be close to outward normal", () => {
		const ball = new Ball({ radius: 8 });
		ball.position.set(100, 0, 0);
		
		const planet = new Planet({ radius: 50, color: "rgb(255,0,0)" });
		planet.position.set(0, 0, 0);
		
		const smallAngle = 0.1; // ~5.7 degrees
		const outwardNormal = ball.position.clone().sub(planet.position).normalize();
		
		for (let i = 0; i < 100; i++) {
			const launchVector = generateLaunchVector(ball, planet, smallAngle);
			const dotProduct = launchVector.dot(outwardNormal);
			const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
			
			// Angle should be less than or equal to smallAngle
			expect(angle).toBeLessThanOrEqual(smallAngle + 0.0001);
		}
	});
	
	test("specific scenario: planet at (10,10,10) radius 5, ball at (10,15,10), angle=0 should launch toward (10,20,10)", () => {
		const ball = new Ball({ radius: 8 });
		ball.position.set(10, 15, 10);
		
		const planet = new Planet({ radius: 5, color: "rgb(255,0,0)" });
		planet.position.set(10, 10, 10);
		
		// With angle = 0, should launch exactly along the outward normal
		const launchVector = generateLaunchVector(ball, planet, 0);
		
		// Calculate expected direction: from planet center (10,10,10) to ball (10,15,10)
		// Direction = (10,15,10) - (10,10,10) = (0,5,0)
		// Normalized = (0,1,0)
		const expectedDirection = new Vector3(0, 1, 0);
		
		// Launch vector should match expected direction
		expect(launchVector.x).toBeCloseTo(expectedDirection.x, 10);
		expect(launchVector.y).toBeCloseTo(expectedDirection.y, 10);
		expect(launchVector.z).toBeCloseTo(expectedDirection.z, 10);
		
		// Verify it points toward (10, 20, 10) by checking the direction
		// If we start at (10, 15, 10) and move in direction (0, 1, 0), we'll reach (10, 20, 10)
		const targetPoint = new Vector3(10, 20, 10);
		const directionToTarget = targetPoint.clone().sub(ball.position).normalize();
		
		expect(launchVector.x).toBeCloseTo(directionToTarget.x, 10);
		expect(launchVector.y).toBeCloseTo(directionToTarget.y, 10);
		expect(launchVector.z).toBeCloseTo(directionToTarget.z, 10);
	});
});
