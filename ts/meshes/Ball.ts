import {
	ArrowHelper,
	Geometry,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	SphereGeometry,
	Vector3,
} from 'three';
import { settings } from '../settings';
import { Tickable } from '../interfaces/Tickable';
import { Planet } from './Planet';

function createBallGeometry(ballRadius: number) {
	return new SphereGeometry(ballRadius, 32, 32);
}

function createBallMaterial() {
	return new MeshBasicMaterial({color: 'rgb(0,250,250)'});
}

export class Ball extends Mesh implements Tickable {
	private isOnPlanet = false;
	private _velocity = new Vector3(0, 0, 0);
	private arrowHelper = new ArrowHelper(new Vector3(), new Vector3(), 50);
	private pathVertices: Vector3[] = [];

	private updateArrowHelper() {
		this.arrowHelper.setDirection(this.velocity.normalize());
		this.arrowHelper.setLength(this.velocity.length() * 20);
	}

	readonly radius: number;
	readonly mass = 3;

	get velocity() {
		return this._velocity.clone();
	}

	set velocity(newVelocity: Vector3) {
		this._velocity = newVelocity;
	}

	constructor({radius = 3}: {
		radius?: number
	} = {}) {
		super(createBallGeometry(radius), createBallMaterial());
		this.radius = radius;

		if(settings.ball.showVelocityVector) {
			this.add(this.arrowHelper);
		}
	}

	addVelocity(vector: Vector3) {
		this._velocity.add(vector);
	}

	createTrace() {
		const lineMaterial = new LineBasicMaterial({
			color: 'red',
		});

		const geometry = new Geometry();

		geometry.vertices = this.pathVertices;

		return new Line(geometry, lineMaterial);
	}

	tick() {
		if (this.isOnPlanet) {
			this.velocity = new Vector3();
		}
		this.rotation.set(0, 0, 0);
		this.position.add(this.velocity);
		const velNorm = this.velocity.normalize();
		this.rotation.set(velNorm.x, velNorm.y, velNorm.z);

		this.updateArrowHelper();
		this.pathVertices.push(this.position.clone());

		setTimeout(() => {
			this.pathVertices.shift();
		}, settings.ball.traceDuration * 1000);
	}
}
