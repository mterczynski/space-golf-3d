import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3, ArrowHelper, LineBasicMaterial, Geometry, Line, ConeGeometry, PerspectiveCamera } from "three";
import { Planet } from "./Planet";
import { SettingsTab } from "./SettingsTab";
import { Tickable } from "./interfaces/Tickable";

export class Ball extends Mesh implements Tickable {
	constructor(private settings: SettingsTab) {
		super(new SphereGeometry(Ball.size, 32, 32), new MeshBasicMaterial({
			color: 'rgb(0,250,250)',
		}));
		this.add(this.arrowHelper);
		this.add(this.camera);
		let coneMesh = new Mesh(new ConeGeometry(4, 12), new MeshBasicMaterial({ wireframe: true }));
		// this.add(coneMesh);
		coneMesh.rotateX(Math.PI / 2);
	}

	private static readonly size = 3;
	private isCollisionBlocked = true;
	private isOnPlanet = false;
	private _velocity = new Vector3(-0.5, 0.5, 0);
	// private _velocity = new Vector3(0, 0, 0);
	private arrowHelper = new ArrowHelper(new Vector3(), new Vector3(), 50);
	private pathVerticies: Vector3[] = [];

	public readonly camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, Math.pow(10, 6));

	get name() { return 'Ball' }
	set name(_) { console.warn('name is readonly') }

	private updateArrowHelper() {
		this.arrowHelper.setDirection(this._velocity.clone().normalize());
		this.arrowHelper.setLength(this._velocity.length() * 20);
	}
	private updateCamera() {
		this.getVelocity().normalize();
		this.camera.position.y = 200;
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
		this.camera.lookAt(new Vector3());
	}

	addVelocity(vector: Vector3) {
		this._velocity = this._velocity.add(vector);
	}
	getLine() {
		var lineMaterial = new LineBasicMaterial({
			color: 0xff0000
		});

		var geometry = new Geometry();

		geometry.vertices = this.pathVerticies;

		return new Line(geometry, lineMaterial);
	}
	getVelocity() {
		return this._velocity.clone();
	}
	isColliding(planet: Planet) {
		if (this.isCollisionBlocked) {
			// console.log('collision blocked, aborting')
			return false;
		}
		if (this.position.distanceTo(planet.position) <= Ball.size + planet.size) {
			// rotate velocity vector by 90 degrees, slow it down
			let axis = new Vector3(0, -1, 0);
			let angle = Math.PI / 2;
			this._velocity.applyAxisAngle(axis, angle).multiplyScalar(0.6);
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
		return planets.some((planet) => {
			return this.isColliding(planet);
		});
	}
	tick() {
		if (this.isOnPlanet) {
			this._velocity = new Vector3();
		}
		this.rotation.set(0, 0, 0);
		this.position.add(this._velocity);
		let velNorm = this.getVelocity().normalize()//.multiplyScalar(Math.PI/2);
		this.rotation.set(velNorm.x, velNorm.y, velNorm.z);

		this.updateArrowHelper();
		this.updateCamera();
		this.pathVerticies.push(this.position.clone());
		setTimeout(() => {
			this.pathVerticies.shift();
		}, this.settings.getSettings().pathDuration * 1000);
	}
}
