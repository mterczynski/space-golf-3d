import { Vector3 } from 'three';

interface Gravitable {
	mass: number,
	position: Vector3
}

export function calcGravityForce({ pulled, puller, timeDelta }: {
	pulled: Gravitable,
	puller: Gravitable,
	timeDelta: number,
}) {
	const directionVector = puller.position.clone().sub(pulled.position);
	const distance = puller.position.distanceTo(pulled.position);

	return directionVector
		.normalize()
		.multiplyScalar(puller.mass)
		.multiplyScalar(pulled.mass)
		.multiplyScalar(timeDelta * 100)
		.divideScalar(distance ** 2);
}
