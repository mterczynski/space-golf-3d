import {
	ArrowHelper,
	BufferGeometry,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	PointLight,
	SphereGeometry,
	Vector3,
} from 'three';
import { settings } from '../settings';
import { Tickable } from '../interfaces/Tickable';
import { Planet } from './Planet';
import { launchBall } from '../utils/launchBall';
import randomColor from 'randomcolor'

function createBallGeometry(ballRadius: number) {
	const quality = 32;
	return new SphereGeometry(ballRadius, quality, quality);
}

function createBallMaterial(color: string) {
	return new MeshBasicMaterial({ color });
}

export class Ball extends Mesh implements Tickable {
	private readonly light;
	private _velocity = new Vector3(0, 0, 0);
	private arrowHelper = new ArrowHelper(new Vector3(), new Vector3());
	private pathVertices: Vector3[] = [];
	readonly color;
	readonly camera = new PerspectiveCamera(settings.cameraFov);
	launchBallTimeout: number | null = null;
	landedPlanet: null | Planet = null; // planet on which the ball has landed

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

	constructor({ radius = settings.ball.radius }: {
		radius?: number
	} = {}) {
		const color = randomColor({ luminosity: 'dark', alpha: 1 });
		super(createBallGeometry(radius), createBallMaterial(color));
		this.light = new PointLight(color, 16_000, 10000);
		this.color = color;
		this.radius = radius;

		if (settings.ball.showVelocityVector) {
			this.add(this.arrowHelper);
		}

		this.add(this.camera);
		this.add(this.light);
	}

	addVelocity(vector: Vector3) {
		this._velocity.add(vector);
	}

	createTrace() {
		const lineMaterial = new LineBasicMaterial({
			color: 0xffaa00,
			opacity: settings.ball.traceTransparency,
			transparent: true,
		});

		const geometry = new BufferGeometry().setFromPoints(this.pathVertices);

		return new Line(geometry, lineMaterial);
	}

	tick() {
		if (this.landedPlanet !== null) {
			this.velocity = new Vector3();
			if (settings.autoLaunch && !this.launchBallTimeout) {
				this.launchBallTimeout = window.setTimeout(() => {
					launchBall(this);
					this.launchBallTimeout = null;
				}, 1000)
			}
		}
		this.rotation.set(0, 0, 0);
		this.position.add(this.velocity);
		const velNorm = this.velocity.normalize();
		this.rotation.set(velNorm.x, velNorm.y, velNorm.z);

		this.updateArrowHelper();
		this.pathVertices.push(this.position.clone());
		this.updateCameraPosition();

		setTimeout(() => {
			this.pathVertices.shift();
		}, settings.ball.traceDuration * 1000);
	}

	private updateCameraPosition() {
		// todo
		this.camera.position.setY(400);
		this.camera.lookAt(this.position);
	}
}
