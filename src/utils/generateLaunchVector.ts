import { Vector3 } from "three";
import { Ball } from "../meshes/Ball";
import { Planet } from "../meshes/Planet";

/**
 * Generates a random launch vector that is guaranteed to point away from the landed planet.
 * 
 * @param ball - The ball to launch
 * @param landedPlanet - The planet the ball is currently on
 * @param maxAngleRange - Maximum angle deviation from the outward normal (in radians).
 *                        0 = exactly along outward normal (vertical launch)
 *                        Math.PI/2 = up to 90 degrees from normal (full hemisphere)
 *                        Math.PI = same as Math.PI/2 (clamped to hemisphere to prevent pointing toward planet)
 *                        Default is Math.PI (full hemisphere).
 *                        Note: Values > Math.PI/2 are clamped to Math.PI/2 to ensure the vector
 *                        always points away from the planet.
 * @returns A normalized direction vector pointing away from the planet
 */
export function generateLaunchVector(
	ball: Ball,
	landedPlanet: Planet,
	maxAngleRange: number = Math.PI
): Vector3 {
	// Calculate the outward normal from planet center to ball position
	const outwardNormal = ball.position.clone().sub(landedPlanet.position).normalize();
	
	// Special case: if maxAngleRange is 0, return the outward normal (vertical launch)
	if (maxAngleRange === 0) {
		return outwardNormal;
	}
	
	// Clamp maxAngleRange to PI/2 to ensure we stay in the hemisphere away from the planet
	// Values > PI/2 would allow directions pointing back toward the planet
	const clampedAngle = Math.min(maxAngleRange, Math.PI / 2);
	
	// Generate a random direction within a cone of angle clampedAngle around the outward normal
	// Using spherical coordinates relative to the outward normal
	
	// Random angle from the outward normal (polar angle in cone)
	// For uniform distribution in the cone, we use: acos(1 - (1 - cos(clampedAngle)) * random)
	const theta = Math.acos(1 - (1 - Math.cos(clampedAngle)) * Math.random());
	
	// Random azimuthal angle around the outward normal
	const phi = Math.random() * 2 * Math.PI;
	
	// Create a coordinate system with outwardNormal as the z-axis
	// Find two perpendicular vectors to outwardNormal
	let perpVector1: Vector3;
	if (Math.abs(outwardNormal.x) < 0.9) {
		perpVector1 = new Vector3(1, 0, 0).cross(outwardNormal).normalize();
	} else {
		perpVector1 = new Vector3(0, 1, 0).cross(outwardNormal).normalize();
	}
	const perpVector2 = outwardNormal.clone().cross(perpVector1).normalize();
	
	// Convert spherical coordinates to Cartesian in the local coordinate system
	const sinTheta = Math.sin(theta);
	const cosTheta = Math.cos(theta);
	const sinPhi = Math.sin(phi);
	const cosPhi = Math.cos(phi);
	
	// Construct the launch direction vector
	const launchDirection = new Vector3(
		sinTheta * cosPhi,
		sinTheta * sinPhi,
		cosTheta
	);
	
	// Transform from local coordinate system to world coordinates
	const result = new Vector3();
	result.addScaledVector(perpVector1, launchDirection.x);
	result.addScaledVector(perpVector2, launchDirection.y);
	result.addScaledVector(outwardNormal, launchDirection.z);
	
	return result.normalize();
}
