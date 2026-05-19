import { Vector3 } from "three";

interface Sphere {
	position: Vector3;
	radius: number;
}

interface Params {
	cameraPosition: Vector3;
	targetSphere: Sphere;
	occludingSpheres: Sphere[];
}

/**
 * Returns true when any occluding sphere is between the camera and at least part of the target sphere.
 */
export function isSphereOccludedFromCamera({ cameraPosition, targetSphere, occludingSpheres }: Params) {
	const targetDirection = targetSphere.position.clone().sub(cameraPosition);
	const targetDistance = targetDirection.length();

	if (targetDistance === 0 || targetSphere.radius <= 0) {
		return false;
	}

	targetDirection.normalize();

	return occludingSpheres.some((occludingSphere) => {
		const combinedRadius = occludingSphere.radius + targetSphere.radius;
		const cameraToOccluder = occludingSphere.position.clone().sub(cameraPosition);
		const projectedDistance = cameraToOccluder.dot(targetDirection);

		if (projectedDistance <= 0) {
			return false;
		}

		// Occluder is entirely beyond the target sphere from the camera point of view.
		if (projectedDistance - combinedRadius > targetDistance) {
			return false;
		}

		const closestPointOnTargetRay = cameraPosition.clone().add(targetDirection.clone().multiplyScalar(projectedDistance));
		const distanceToTargetRay = occludingSphere.position.distanceTo(closestPointOnTargetRay);

		return distanceToTargetRay <= combinedRadius;
	});
}
