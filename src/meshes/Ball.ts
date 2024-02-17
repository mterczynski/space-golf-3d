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
import randomColor from 'randomcolor'
import { playSound } from '../utils/playSound';
import { calculateFlight } from '../utils/calculateFlight';
import { ElementGetter } from '../ElementGetter';

// interface Flight {
// 	durationInSeconds: number;
// 	endedInLanding: boolean;
// 	coordinates: Vector3[] // each item represents a position after each tick
// }

// todo - move somewhere else
export type Flight = {
	ticks: {
		position: Vector3,
		velocity: Vector3
	}[],
	/** indexes of ticks with collisions */
	ticksWithCollisions: number[],
}


function createBallGeometry(ballRadius: number) {
	const quality = 32;
	return new SphereGeometry(ballRadius, quality, quality);
}

function createBallMaterial(color: string) {
	return new MeshBasicMaterial({ color });
}

export class Ball extends Mesh implements Tickable {
	private readonly planets: Planet[] = []
	private readonly light;
	private _velocity = new Vector3(0, 0, 0);
	private arrowHelper = new ArrowHelper(new Vector3(), new Vector3());
	private pathVertices: Vector3[] = [];
	private currentFlight: Flight | null = null
	readonly color;
	readonly camera = new PerspectiveCamera(settings.camera.fov);
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

	// launch(directionVector?: Vector3) {
	// 	const launchVector = new Vector3(
	// 		directionVector?.x || Math.random(),
	// 		directionVector?.y || Math.random(),
	// 		directionVector?.z || Math.random()
	// 	).normalize().multiplyScalar(settings.ball.launchForce)

	// 	this.landedPlanet = null;
	// 	// this.velocity = launchVector;

	// 	playSound.ballFlightStart()
	// 	this.currentFlight = this.calculateFlight(launchVector, settings.ball.maxFlightDurationInSeconds)
	// }

	constructor({ radius = settings.ball.radius, planets }: {
		radius?: number,
		planets?: Planet[] // todo - refactor, planets shouldn't be passed here
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
		this.planets = planets || []
	}

	// calculateFlight(hitVector: Vector3, maxFlightDurationInSeconds: number): Flight {
	// 	const ticks: any[] = []
	// 	const startingPosition = this.position.clone();

	// 	ticks.push({
	// 		velocity: hitVector,
	// 		position: startingPosition
	// 	})

	// 	for (let tick = 1; tick < settings.ticksPerSecond * maxFlightDurationInSeconds; tick++) {
	// 		const lastTick = ticks[tick - 1]



	// 		ticks.push({
	// 			velocity: lastTick,
	// 			position: startingPosition
	// 		})

	// 		if (landed) {
	// 			break;
	// 		}
	// 	}

	// 	return flight
	// }

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

	createFullFlightTrace(): Line[] {
		if (!this.currentFlight) return [];

		const lineMaterial = new LineBasicMaterial({
			color: 0xffaa00,
			opacity: settings.ball.traceTransparency,
			transparent: true,
		});

		return this.currentFlight.map(t => t.position).slice(1).map((position, index) => {
			const pointA = this.currentFlight![index].position;
			const pointB = position;
			const geometry = new BufferGeometry().setFromPoints([pointA, pointB])
			return new Line(geometry, lineMaterial);
		})


		// return new Line(geometry, lineMaterial);
	}

	tick() {
		if (this.landedPlanet !== null) {
			this.velocity = new Vector3();
			if (settings.simulationMode && !this.launchBallTimeout) {
				// const launchVector = new Vector3(-0.8, 0.18, -0.72)
				// // this.launch(new Vector3(-0.8, 0.18, -0.72));

				// const flight = calculateFlight(launchVector, this, this.planets)
				// this.currentFlight = flight

				// this.parent?.add(this.createFullFlightTrace()!)

				// console.log('## flight result', calculateFlight(launchVector, this, this.planets))
				// this.launchBallTimeout = null;

				this.launchBallTimeout = window.setTimeout(() => {
					const launchVector = new Vector3(-0.8, 0.18, -0.72).normalize().multiplyScalar(settings.ball.launchForce)
					// this.launch(new Vector3(-0.8, 0.18, -0.72));

					const start = Date.now()
					const flight = calculateFlight(launchVector, this, this.planets)
					const end = Date.now()
					console.log('## calculateFlight took', end - start)
					this.currentFlight = flight

					this.parent?.add(...this.createFullFlightTrace()!)

					// console.log('## flight result', calculateFlight(launchVector, this, this.planets).ticks.map(t => Math.floor(t.position.y)))
					// console.log('## flight result', calculateFlight(launchVector, this, this.planets))
					// this.launchBallTimeout = null;
				}, 3000) // todo - change to 1000
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
