import { Vector3 } from "three";
import { Ball } from "../meshes/Ball";
import { Planet } from "../meshes/Planet";
import { settings } from "../settings";
import { playSound } from "./playSound";
import { calculateFlight, Flight } from "./calculateFlight";

export function launchBall(ball: Ball, directionVector: Vector3, planets: Planet[] = []) {
	const launchVector = new Vector3(
		directionVector.x,
		directionVector.y,
		directionVector.z
	)
		.normalize()
		.multiplyScalar(settings.ball.launchForce);

	ball.landedPlanet = null;
	ball.velocity = launchVector;

	if (settings.usePreCalculatedFlight && planets.length > 0) {
		const flight = calculateFlight(launchVector, ball, planets);
		ball.setPreCalculatedFlight(flight);
	}

	playSound.ballFlightStart();
}
