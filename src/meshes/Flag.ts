import { CylinderGeometry, Mesh, MeshBasicMaterial } from "three";

const POLE_HEIGHT = 20;
const POLE_RADIUS = 0.8;

export class Flag extends Mesh {
	constructor() {
		super(
			new CylinderGeometry(POLE_RADIUS, POLE_RADIUS, POLE_HEIGHT, 8),
			new MeshBasicMaterial({ color: 0x888888 })
		);
	}
}
