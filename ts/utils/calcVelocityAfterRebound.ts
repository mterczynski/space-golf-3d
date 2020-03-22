import { Vector3 } from 'three';
import { settings } from '../settings';

interface Sphere {
	radius: number,
	position: Vector3,
}

interface MovingSphere extends Sphere {
	velocity: Vector3
}

export function calcVelocityAfterRebound({
	staticSphere,
	movingSphere,
	onBounceVelocityMultiplier = settings.defaultOnBounceVelocityMultiplier
}: {
	staticSphere: Sphere,
	movingSphere: MovingSphere,
	onBounceVelocityMultiplier?: number,
}) {
	const distanceAxis = movingSphere.position.clone().sub(staticSphere.position).normalize();
	const dotProduct = distanceAxis.dot(movingSphere.velocity);
	const reflectedVelocity = movingSphere.velocity.clone().sub(distanceAxis.clone().multiplyScalar(2 * dotProduct));

	return reflectedVelocity.multiplyScalar(onBounceVelocityMultiplier);
}
