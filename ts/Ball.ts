import {
	ArrowHelper,
	Geometry,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	SphereGeometry,
	Vector3,
} from 'three';
import { Tickable } from './interfaces/Tickable';
import { Planet } from './Planet';
import { settings } from './settings';

export class Ball extends Mesh implements Tickable {

	private static readonly size = 3;
	private isCollisionBlocked = true;
	private isOnPlanet = false;
	private velocity = new Vector3(-0.5, 0.5, 0);
	private arrowHelper = new ArrowHelper(new Vector3(), new Vector3(), 50);
	private pathVerticies: Vector3[] = [];

	private updateArrowHelper() {
		this.arrowHelper.setDirection(this.velocity.clone().normalize());
		this.arrowHelper.setLength(this.velocity.length() * 20);
	}

	readonly name = 'Ball';

	constructor() {
		super(new SphereGeometry(Ball.size, 32, 32), new MeshBasicMaterial({
			color: 'rgb(0,250,250)',
		}));
	}

	addVelocity(vector: Vector3) {
		this.velocity = this.velocity.add(vector);
	}

	getLine() {
		const lineMaterial = new LineBasicMaterial({
			color: 'red',
		});

		const geometry = new Geometry();

		geometry.vertices = this.pathVerticies;

		return new Line(geometry, lineMaterial);
	}

	getVelocity() {
		return this.velocity.clone();
	}

	isColliding(planet: Planet) {
		if (this.isCollisionBlocked) {
			return false;
		}

		if (this.position.distanceTo(planet.position) <= Ball.size + planet.radius) {
			// rotate velocity vector by 90 degrees, slow it down
			const axis = new Vector3(0, -1, 0);
			const angle = Math.PI / 2;
			this.velocity.applyAxisAngle(axis, angle).multiplyScalar(0.6);
			this.isCollisionBlocked = true;

			if (this.getVelocity().length() <= 0.02) {
				this.isOnPlanet = true;
			}
			setTimeout(() => {
				this.isCollisionBlocked = false;
			}, 150);

			return true;
		} else {
			return false;
		}
	}

	isCollidingWithAny(planets: Planet[]) {
		return planets.some(planet => this.isColliding(planet));
	}

	tick() {
		if (this.isOnPlanet) {
			this.velocity = new Vector3();
		}
		this.rotation.set(0, 0, 0);
		this.position.add(this.velocity);
		const velNorm = this.getVelocity().normalize();
		this.rotation.set(velNorm.x, velNorm.y, velNorm.z);

		this.updateArrowHelper();
		this.pathVerticies.push(this.position.clone());

		setTimeout(() => {
			this.pathVerticies.shift();
		}, settings.pathDuration * 1000);
	}
}
