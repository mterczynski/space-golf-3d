import { Vector3 } from "three";

interface Sphere {
	radius: number;
	position: Vector3;
}

export function adjustBallPositionAfterCollision(ball: Sphere, planet: Sphere): Vector3 {
	const directionVector = ball.position
		.clone()
		.sub(planet.position)
		.normalize()
		.multiplyScalar(planet.radius + ball.radius);
	const newBallPosition = planet.position.clone().add(directionVector);
	ball.position.set(newBallPosition.x, newBallPosition.y, newBallPosition.z);
	return newBallPosition;
}
