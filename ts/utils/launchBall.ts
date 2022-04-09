import { Vector3 } from "three";
import { Ball } from "../meshes/Ball";
import { settings } from "../settings";

export function launchBall(ball: Ball) {
	const launchVector = new Vector3(Math.random(), Math.random(), Math.random()).normalize().multiplyScalar(settings.ball.launchForce)

	ball.isOnPlanet = false;
	ball.velocity = launchVector;
}
