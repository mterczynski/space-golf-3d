import { Group, PerspectiveCamera, Vector3 } from "three";
import { Tickable } from "./interfaces/Tickable";
import { settings } from "./settings";

const createCamera = () => new PerspectiveCamera(settings.cameraFov, innerWidth / innerHeight, 0.1, Math.pow(10, 6));

export class DistantCameras extends Group {
	private readonly cameras = [
		createCamera(),
		createCamera(),
		createCamera(),
		createCamera(),

		createCamera(),
		createCamera(),
		createCamera(),
		createCamera(),
	];
	private activeCamera = this.cameras[0];
	private lastSwitchDate = Date.now();

	constructor() {
		super();

		this.initializeCameraPositions();
	}

	private initializeCameraPositions() {
		const cameraOffset = settings.maxPlanetOffset + 900;
		const n = -cameraOffset;
		const p = cameraOffset;

		this.cameras[0].position.set(n, n / 2, n);
		this.cameras[1].position.set(n, n / 2, p);
		this.cameras[2].position.set(n, p / 2, n);
		this.cameras[3].position.set(n, p / 2, p);
		this.cameras[4].position.set(p, n / 2, n);
		this.cameras[5].position.set(p, n / 2, p);
		this.cameras[6].position.set(p, p / 2, n);
		this.cameras[7].position.set(p, p / 2, p);
	}

	private selectActiveCamera(ballPosition: Vector3) {
		const minimumTimeOnOneCamera = 3000;
		const timeElapsedFromLastSwitch = Date.now() - this.lastSwitchDate;
		if (timeElapsedFromLastSwitch < minimumTimeOnOneCamera) {
			return;
		}

		const newActiveCameraIndex =
			Number((ballPosition.x > 0)) * 4 +
			Number((ballPosition.y > 0)) * 2 +
			Number((ballPosition.z > 0)) * 1;

		this.lastSwitchDate = Date.now();
		this.activeCamera = this.cameras[newActiveCameraIndex];
	}

	private updateActiveCamera(ballPosition: Vector3) {
		this.activeCamera.aspect = innerWidth / innerHeight;
		this.activeCamera.updateProjectionMatrix();
		this.activeCamera.lookAt(ballPosition);
	}

	getActiveCamera() {
		return this.activeCamera;
	}

	update(ballPosition: Vector3) {
		this.selectActiveCamera(ballPosition);
		this.updateActiveCamera(ballPosition);
	}
}
