import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

export class Net extends Mesh {
	constructor() {
		const geo = new PlaneGeometry(300, 300, 30, 30);
		const mat = new MeshBasicMaterial({
			color: 'rgb(255,255,255)',
			side: DoubleSide,
			wireframe: true,
		});
		super(geo, mat);
		this.rotateX(Math.PI / 2);
	}
}
