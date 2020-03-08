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

	get acceleration() {
		return this.mass * settings.gravityMultiplier;
	}

	get mass() {
		const volumeMultiplier = Math.PI * 4 / 3;

		return settings.planetDensity * (this.radius ** 3) * volumeMultiplier;
	}

	readonly name = 'Planet';
	readonly radius: number;

	constructor({radius, color = new Color('red')}: {
		radius: number,
		color?: Color
	}) {
		super(new SphereGeometry(radius, 32, 32), new MeshPhongMaterial({ color }));
		this.radius = radius;
		const border = createBorderMesh(radius);
		this.add(border);
	}

	calcGravity(ball: Ball): Vector3 {
		const distance = ball.position.distanceTo(this.position);
		const scalar = this.acceleration / Math.pow(distance, 2);

		return new Vector3().subVectors(this.position, ball.position).normalize().multiplyScalar(scalar);
	}
}
