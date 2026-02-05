import { Vector3 } from "three";
import { Ball } from "../meshes/Ball";
import { Planet } from "../meshes/Planet";

/**
 * Generates a random launch vector that is guaranteed to point away from the landed planet.
 * The vector will be in the hemisphere defined by the outward normal from the planet center to the ball position.
 * 
 * @param ball - The ball to launch
 * @param landedPlanet - The planet the ball is currently on
 * @param alphaAngle - The maximum angle deviation from the outward normal (in radians). Default is Math.PI (180 degrees).
 * @returns A normalized direction vector pointing away from the planet
 */
export function generateLaunchVector(
	ball: Ball,
	landedPlanet: Planet,
	alphaAngle: number = Math.PI
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
	
	// Optionally constrain within the alpha angle from the outward normal
	// For now, we're using the full hemisphere (alpha = Math.PI / 2 would be a cone)
	// This is already achieved by the reflection above
	
	return launchDirection.normalize();
}
