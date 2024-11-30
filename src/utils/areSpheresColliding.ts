import { Vector3 } from 'three';

interface Sphere {
	radius: number,
	position: Vector3
}

export function areSpheresColliding(sphere1: Sphere, sphere2: Sphere) {
	const distance = sphere1.position.distanceTo(sphere2.position);

	return distance <= sphere1.radius + sphere2.radius;
}
