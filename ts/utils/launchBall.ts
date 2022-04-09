import { Vector3 } from "three";
import { Ball } from "../meshes/Ball";

export function launchBall(ball: Ball) {
	const launchVector = new Vector3(Math.random(), Math.random(), Math.random()).normalize().multiplyScalar(5)

	ball.isOnPlanet = false;
	ball.velocity = launchVector;
}
