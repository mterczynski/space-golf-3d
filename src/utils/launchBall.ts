import { Vector3 } from "three";
import { Ball } from "../meshes/Ball";
import { settings } from "../settings";
import { playSound } from "./playSound";

export function launchBall(ball: Ball, directionVector?: Vector3) {
	const launchVector = new Vector3(
		directionVector?.x || Math.random(),
		directionVector?.y || Math.random(),
		directionVector?.z || Math.random()
	).normalize().multiplyScalar(settings.ball.launchForce)

	ball.landedPlanet = null;
	ball.velocity = launchVector;

	playSound.ballFlightStart()
}
