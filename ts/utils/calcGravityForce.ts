import { Vector3 } from 'three';

interface Gravitable {
	mass: number,
	position: Vector3
}

export function calcGravityForce(object1: Gravitable, object2: Gravitable) {
	return object1.mass * object2.mass / (object1.position.distanceToSquared(object2.position))
}
