import { Vector3 } from "three";
import { Ball } from "../meshes/Ball";
import { Planet } from "../meshes/Planet";

/**
 * Generates a random launch vector that is guaranteed to point away from the landed planet.
 * 
 * @param ball - The ball to launch
 * @param landedPlanet - The planet the ball is currently on
 * @param maxAngleRange - The full angular range in radians for possible launch directions.
 *                        Math.PI (180 degrees) allows the full hemisphere away from the planet.
 *                        Smaller values constrain the launch to a narrower cone around the outward normal.
 *                        Default is Math.PI (full hemisphere).
 * @returns A normalized direction vector pointing away from the planet
 */
export function generateLaunchVector(
	ball: Ball,
	landedPlanet: Planet,
	maxAngleRange: number = Math.PI
): Vector3 {
	// Calculate the outward normal from planet center to ball position
	const outwardNormal = ball.position.clone().sub(landedPlanet.position).normalize();
	
	// Generate a random vector
	const randomVector = new Vector3(
		Math.random() * 2 - 1,  // Random value between -1 and 1
		Math.random() * 2 - 1,
		Math.random() * 2 - 1
	).normalize();
	
	// Project the random vector onto the hemisphere away from the planet
	// by ensuring the dot product with the outward normal is positive
	let launchDirection = randomVector.clone();
	
	// If the random vector points towards the planet (negative dot product),
	// reflect it to point away from the planet
	const dotProduct = launchDirection.dot(outwardNormal);
	if (dotProduct < 0) {
		// Reflect the vector across the plane perpendicular to the outward normal
		launchDirection = launchDirection.sub(
			outwardNormal.clone().multiplyScalar(2 * dotProduct)
		);
	}
	
	// Note: For the initial implementation, we use the full hemisphere (maxAngleRange = Math.PI).
	// If a narrower cone is needed in the future, additional constraint logic could be added here
	// to reject and regenerate vectors that exceed the maxAngle from the outward normal.
	
	return launchDirection.normalize();
}
