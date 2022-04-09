import {
	ArrowHelper,
	BufferAttribute,
	BufferGeometry,
	// Geometry,
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

export class Ball implements Tickable {
	private readonly _mesh = new Mesh();
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

	get position(): Vector3 {
		return this._mesh.position;
	}

	get mesh(): Mesh {
		return this.mesh;
	}

	constructor({radius = 3}: {
		radius?: number
	} = {}) {
		this._mesh = new Mesh(createBallGeometry(radius), createBallMaterial());
		this.radius = radius;

		if(settings.ball.showVelocityVector) {
			this._mesh.add(this.arrowHelper);
		}
	}

	addVelocity(vector: Vector3) {
		this._velocity.add(vector);
	}

	createTrace() {
		const lineMaterial = new LineBasicMaterial({
			color: 'red',
		});

		const geometry = new BufferGeometry();

		// const vertices = new Float32Array( [
		// 	-1.0, -1.0,  1.0,
		// 	 1.0, -1.0,  1.0,
		// 	 1.0,  1.0,  1.0,
		
		// 	 1.0,  1.0,  1.0,
		// 	-1.0,  1.0,  1.0,
		// 	-1.0, -1.0,  1.0
		// ] );

		const vertices = new Float32Array(this.pathVertices.map(v => [v.x, v.y, v.z]).flat() );

		geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) )


// geometry.attributes.position
		// geometry.vertices = this.pathVertices;

		return new Line(geometry, lineMaterial);
	}

	tick() {
		if (this.isOnPlanet) {
			this.velocity = new Vector3();
		}
		this._mesh.rotation.set(0, 0, 0);
		this._mesh.position.add(this.velocity);
		const velNorm = this.velocity.normalize();
		this._mesh.rotation.set(velNorm.x, velNorm.y, velNorm.z);

		this.updateArrowHelper();
		this.pathVertices.push(this._mesh.position.clone());

		setTimeout(() => {
			this.pathVertices.shift();
		}, settings.ball.traceDuration * 1000);
	}
}
