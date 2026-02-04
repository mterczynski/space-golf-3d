import {
	ArrowHelper,
	BufferGeometry,
	ConeGeometry,
	CylinderGeometry,
	Float32BufferAttribute,
	Group,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	PointLight,
	Quaternion,
	SphereGeometry,
	Vector3,
} from "three";
import { settings } from "../settings";
import { Tickable } from "../interfaces/Tickable";
import { Planet } from "./Planet";
import { launchBall } from "../utils/launchBall";
import randomColor from "randomcolor";

function createBallGeometry(ballRadius: number) {
	const quality = 32;
	return new SphereGeometry(ballRadius, quality, quality);
}

function createRocketGeometry(ballRadius: number) {
	const group = new Group();
	
	// Rocket body (cylinder) - made slightly wider and shorter
	const bodyHeight = ballRadius * 2.2;
	const bodyRadius = ballRadius * 0.45;
	const bodyGeometry = new CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 16);
	const body = new Mesh(bodyGeometry);
	body.position.y = 0;
	group.add(body);
	
	// Rocket nose cone - made more pointed
	const noseHeight = ballRadius * 1.0;
	const noseGeometry = new ConeGeometry(bodyRadius, noseHeight, 16);
	const nose = new Mesh(noseGeometry);
	nose.position.y = bodyHeight / 2 + noseHeight / 2;
	group.add(nose);
	
	// Rocket fins (4 triangular fins) - RED and properly sized
	const finWidth = ballRadius * 1.2;
	const finHeight = ballRadius * 1.0;
	const redMaterial = new MeshBasicMaterial({ color: 0xff0000 }); // Red color
	
	for (let i = 0; i < 4; i++) {
		const finGeometry = createTriangularFinGeometry(finWidth, finHeight);
		const fin = new Mesh(finGeometry, redMaterial);
		
		const angle = (i * Math.PI) / 2;
		fin.position.x = Math.cos(angle) * bodyRadius;
		fin.position.z = Math.sin(angle) * bodyRadius;
		fin.position.y = -bodyHeight / 2;
		
		// Rotate fin to point outward
		fin.rotation.y = angle;
		
		group.add(fin);
	}
	
	// Rotate the entire rocket to point forward (along z-axis)
	group.rotation.x = Math.PI / 2;
	
	return group;
}

function createTriangularFinGeometry(width: number, height: number): BufferGeometry {
	// Create a triangular fin using BufferGeometry
	const geometry = new BufferGeometry();
	
	// Define vertices for a triangular fin (pyramid with triangular base)
	const vertices = new Float32Array([
		// Front face (triangle)
		0, height, 0,           // top point
		-width/2, 0, width/2,   // bottom left
		width/2, 0, width/2,    // bottom right
		
		// Back face (triangle)
		0, height, 0,           // top point
		width/2, 0, -width/2,   // bottom right back
		-width/2, 0, -width/2,  // bottom left back
		
		// Left face (triangle)
		0, height, 0,           // top point
		-width/2, 0, -width/2,  // bottom left back
		-width/2, 0, width/2,   // bottom left front
		
		// Right face (triangle)
		0, height, 0,           // top point
		width/2, 0, width/2,    // bottom right front
		width/2, 0, -width/2,   // bottom right back
	]);
	
	geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
	geometry.computeVertexNormals();
	
	return geometry;
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
					// Keep red material for fins, apply ball color to body and nose
					if (!child.material || !(child.material instanceof MeshBasicMaterial) || (child.material as MeshBasicMaterial).color.getHex() !== 0xff0000) {
						child.material = createBallMaterial(color);
					}
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
			if (settings.simulationMode && !this.launchBallTimeout) {
				this.launchBallTimeout = window.setTimeout(() => {
					launchBall(this, new Vector3(-0.8, 0.18, -0.72));
					this.launchBallTimeout = null;
				}, 1000);
			}
		}
		
		this.position.add(this.velocity);
		
		// Handle rotation differently for rocket vs ball
		if (settings.ball.useRocketModel && this.velocity.length() > 0.001) {
			// For rocket: orient to face the velocity direction
			// The rocket is built pointing along +Z axis, so we need to rotate it to point along velocity
			const up = new Vector3(0, 1, 0);
			const velocityDirection = this.velocity.clone().normalize();
			
			// Create a quaternion that rotates from the rocket's default direction (z-axis) to velocity direction
			const quaternion = new Quaternion();
			quaternion.setFromUnitVectors(new Vector3(0, 0, 1), velocityDirection);
			this.quaternion.copy(quaternion);
		} else {
			// For ball: use the original rotation logic
			this.rotation.set(0, 0, 0);
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
