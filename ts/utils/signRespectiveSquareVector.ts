import { Vector3 } from 'three';

export function signRespectiveSquareVector(vector: Vector3) {
	const copy = vector.clone();

	const xSign = Math.sign(copy.x);
	const ySign = Math.sign(copy.y);
	const zSign = Math.sign(copy.z);

	copy.setX(xSign * Math.abs(copy.x ** 2));
	copy.setY(ySign * Math.abs(copy.y ** 2));
	copy.setZ(zSign * Math.abs(copy.z ** 2));

	return copy;
}
