import { BackSide, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Vector3 } from 'three';
import { Ball } from './Ball';
import { settings } from './settings';

function createBorderMesh(planetRadius: number) {
	const borderMaterial = new MeshBasicMaterial({
		color: 'rgb(0,0,0)',
		side: BackSide,
	});

	const widthSegments = 32;
	const heightSegments = 32;
	const borderThickness = 1;

	return new Mesh(
		new SphereGeometry(
			planetRadius + borderThickness,
			widthSegments,
			heightSegments
		),
		borderMaterial
	);
}

export class Planet extends Mesh {
	get mass() {
		// https://en.wikipedia.org/wiki/Sphere#Enclosed_volume
		const sphereVolumeMultiplier = Math.PI * 4 / 3;

		return settings.planetDensity * (this.radius ** 3) * sphereVolumeMultiplier;
	}

	readonly radius: number;

	constructor({radius, color = new Color('red')}: {
		radius: number,
		color?: Color
	}) {
		super(new SphereGeometry(radius, 32, 32), new MeshPhongMaterial({ color }));
		this.radius = radius;
		this.add(createBorderMesh(radius));
	}

	calcGravity(ball: Ball): Vector3 {
		const distance = ball.position.distanceTo(this.position);
		const scalar = this.mass / (distance ** 2);

		return new Vector3().subVectors(this.position, ball.position).normalize().multiplyScalar(scalar);
	}
}
