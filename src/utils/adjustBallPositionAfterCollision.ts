import { Vector3 } from "three";
import { Ball } from "../meshes/Ball";
import { Planet } from "../meshes/Planet";

interface Sphere {
	radius: number,
	position: Vector3,
}

// export function adjustBallPositionAfterCollision(ball: Ball, planet: Sphere) {
// 	const directionVector = ball.position.clone().sub(planet.position).normalize().multiplyScalar(planet.radius + ball.radius);
// 	const newBallPosition = planet.position.clone().add(directionVector);
// 	ball.position.set(newBallPosition.x, newBallPosition.y, newBallPosition.z);
// }

export function adjustBallPositionAfterCollision(ball: Pick<Ball, 'position' | 'radius'>, planet: Sphere) {
	const directionVector = ball.position.clone().sub(planet.position).normalize().multiplyScalar(planet.radius + ball.radius);
	const newBallPosition = planet.position.clone().add(directionVector);
	return new Vector3(newBallPosition.x, newBallPosition.y, newBallPosition.z);
}
