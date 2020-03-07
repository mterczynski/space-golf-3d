import { BackSide, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Vector3 } from 'three';
import { Ball } from './Ball';
import { SettingsTab } from './SettingsTab';

export class Planet extends Mesh {

	private readonly shadowMat = new MeshBasicMaterial({
		color: 'rgb(0,0,0)',
		side: BackSide,
	});

	get acceleration() {
		return this.mass / Math.pow(10, 4.3) * this.settings.getSettings().gravity;
	}

	get mass() {
		const volumeMultiplier = Math.PI * 4 / 3;

		return this.density * (this.size ** 3) * volumeMultiplier;
	}

	readonly name = 'Planet';
	readonly density = 5;

	constructor(
		readonly size: number,
		private settings: SettingsTab,
		color = new Color('rgb(255,0,0)'),
	) {
		super(new SphereGeometry(size, 32, 32), new MeshPhongMaterial({ color }));
		const shadowMesh = new Mesh(new SphereGeometry(size + 1, 32, 32), this.shadowMat);
		this.add(shadowMesh);
	}

	calcGravity(ball: Ball): Vector3 {
		const distance = ball.position.distanceTo(this.position);
		const scalar = this.acceleration / Math.pow(distance, 2);

		return new Vector3().subVectors(this.position, ball.position).normalize().multiplyScalar(scalar);
	}
}
