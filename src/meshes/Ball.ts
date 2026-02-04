import {
	ArrowHelper,
	BufferGeometry,
	ConeGeometry,
	CylinderGeometry,
	Group,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	PointLight,
	SphereGeometry,
	Vector3,
} from "three";
import { settings } from "../settings";
import { Tickable } from "../interfaces/Tickable";
import { Planet } from "./Planet";
import { launchBall } from "../utils/launchBall";
import { Flight } from "../utils/calculateFlight";
import randomColor from "randomcolor";

function createBallGeometry(ballRadius: number) {
	const quality = 32;
	return new SphereGeometry(ballRadius, quality, quality);
}

function createRocketGeometry(ballRadius: number) {
	const group = new Group();
	
	// Rocket body (cylinder)
	const bodyHeight = ballRadius * 2.5;
	const bodyRadius = ballRadius * 0.4;
	const bodyGeometry = new CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 16);
	const body = new Mesh(bodyGeometry);
	body.position.y = 0;
	group.add(body);
	
	// Rocket nose cone
	const noseHeight = ballRadius * 0.8;
	const noseGeometry = new ConeGeometry(bodyRadius, noseHeight, 16);
	const nose = new Mesh(noseGeometry);
	nose.position.y = bodyHeight / 2 + noseHeight / 2;
	group.add(nose);
	
	// Rocket fins (4 triangular fins)
	const finHeight = ballRadius * 0.8;
	for (let i = 0; i < 4; i++) {
		const finGeometry = new ConeGeometry(0, finHeight, 3);
		const fin = new Mesh(finGeometry);
		fin.rotation.z = Math.PI / 2;
		const angle = (i * Math.PI) / 2;
		fin.position.x = Math.cos(angle) * bodyRadius;
		fin.position.z = Math.sin(angle) * bodyRadius;
		fin.position.y = -bodyHeight / 2 + finHeight / 2;
		group.add(fin);
	}
	
	// Rotate the entire rocket to point forward (along z-axis)
	group.rotation.x = Math.PI / 2;

	group.scale.set(3, 3, 3);
	
	return group;
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
	readonly camera = new PerspectiveCamera(settings.camera.fov);
	launchBallTimeout: number | null = null;
	landedPlanet: null | Planet = null; // planet on which the ball has landed
	private preCalculatedFlight: Flight | null = null;
	private currentFlightTick = 0;
	private flightStartTime: number | null = null;

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

	constructor({
		radius = settings.ball.radius,
	}: {
		radius?: number;
	} = {}) {
		const color = randomColor({ luminosity: "dark", alpha: 1 });
		
		// Create geometry based on setting
		const INVISIBLE_SPHERE_RADIUS = 0.1;
		const INVISIBLE_SPHERE_SEGMENTS = 4;
		let baseGeometry: SphereGeometry;
		let rocketModel: Group | null = null;
		
		if (settings.ball.useRocketModel) {
			// Use a tiny invisible sphere as the base mesh when using rocket model
			baseGeometry = new SphereGeometry(
				INVISIBLE_SPHERE_RADIUS,
				INVISIBLE_SPHERE_SEGMENTS,
				INVISIBLE_SPHERE_SEGMENTS
			);
			rocketModel = createRocketGeometry(radius) as Group;
		} else {
			baseGeometry = createBallGeometry(radius);
		}
		
		super(baseGeometry, createBallMaterial(color));
		
		// Add rocket model if using rocket
		if (rocketModel) {
			rocketModel.traverse((child) => {
				if (child instanceof Mesh) {
					child.material = createBallMaterial(color);
				}
			});
			this.add(rocketModel);
		}
		
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

	setPreCalculatedFlight(flight: Flight) {
		this.preCalculatedFlight = flight;
		this.currentFlightTick = 0;
		this.flightStartTime = Date.now();
	}

	clearPreCalculatedFlight() {
		this.preCalculatedFlight = null;
		this.currentFlightTick = 0;
		this.flightStartTime = null;
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

	tick(planets: Planet[] = []) {
		if (this.landedPlanet !== null) {
			this.velocity = new Vector3();
			if (settings.simulationMode && !this.launchBallTimeout) {
				this.launchBallTimeout = window.setTimeout(() => {
					launchBall(this, new Vector3(-0.8, 0.18, -0.72), planets);
					this.launchBallTimeout = null;
				}, 1000);
			}
		}

		// Use pre-calculated flight if available
		if (settings.usePreCalculatedFlight && this.preCalculatedFlight && this.flightStartTime !== null) {
			// Calculate which tick we should be on based on elapsed time
			const elapsedSeconds = (Date.now() - this.flightStartTime) / 1000;
			const targetTick = Math.floor(elapsedSeconds * settings.ticksPerSecond);
			
			if (targetTick < this.preCalculatedFlight.ticks.length) {
				const tickData = this.preCalculatedFlight.ticks[targetTick];
				this.position.copy(tickData.position);
				this.velocity = tickData.velocity.clone();
				this.currentFlightTick = targetTick;
			} else {
				// Flight has ended
				const lastTick = this.preCalculatedFlight.ticks[this.preCalculatedFlight.ticks.length - 1];
				this.position.copy(lastTick.position);
				this.velocity = lastTick.velocity.clone();
				this.clearPreCalculatedFlight();
			}
		} else if (!settings.usePreCalculatedFlight || !this.preCalculatedFlight) {
			// Original real-time flight logic
			this.rotation.set(0, 0, 0);
			this.position.add(this.velocity);
			const velNorm = this.velocity.normalize();
			this.rotation.set(velNorm.x, velNorm.y, velNorm.z);
		}

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
