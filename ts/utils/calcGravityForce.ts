import { Vector3 } from 'three';
import { settings } from '../settings';

interface Gravitable {
	mass: number,
	position: Vector3
}

export function calcGravityForce({pulled, puller} : {
	pulled: Gravitable,
	puller: Gravitable,
}) {
	const directionVector = puller.position.clone().sub(pulled.position);
	const distance = puller.position.distanceTo(pulled.position);

	return directionVector
		.normalize()
		.multiplyScalar(puller.mass)
		.multiplyScalar(pulled.mass)
		.divideScalar(distance ** 2);
}
