import { BackSide, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Vector3 } from 'three';
import { Ball } from './Ball';
import { SettingsTab } from './SettingsTab';

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
		return this.mass / Math.pow(10, 4.3) * this.settings.getSettings().gravity;
	}

	get mass() {
		const volumeMultiplier = Math.PI * 4 / 3;

		return this.density * (this.radius ** 3) * volumeMultiplier;
	}

	readonly name = 'Planet';
	readonly density = 5;

	constructor(
		readonly radius: number,
		private settings: SettingsTab,
		color = new Color('rgb(255,0,0)'),
	) {
		super(new SphereGeometry(radius, 32, 32), new MeshPhongMaterial({ color }));
		const border = createBorderMesh(radius);
		this.add(border);
	}

	calcGravity(ball: Ball): Vector3 {
		const distance = ball.position.distanceTo(this.position);
		const scalar = this.acceleration / Math.pow(distance, 2);

		return new Vector3().subVectors(this.position, ball.position).normalize().multiplyScalar(scalar);
	}
}
