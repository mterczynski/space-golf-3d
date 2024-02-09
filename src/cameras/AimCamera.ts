import { PerspectiveCamera, Vector3 } from "three";
import { settings } from "../settings";
import { Ball } from "../meshes/Ball";
import { OrbitControls } from 'three/examples/jsm/Addons';

export class AimCamera extends PerspectiveCamera {
	private readonly orbitControls: OrbitControls

	constructor(domElement: HTMLElement) {
		super(settings.camera.fov, innerWidth / innerHeight, settings.camera.near, settings.camera.far)

		this.position.set(400, 200, 40);
		this.orbitControls = new OrbitControls(this, domElement);
		this.lookAt(new Vector3());
	}

	/**
	 * Resets the camera position based on position of the ball and its planet
	 */
	reset(ball: Ball) {
		if (!ball.landedPlanet) return

		const ballPos = ball.position.clone()
		const planetPos = ball.landedPlanet?.position.clone()
		const ballToPlanetVector = planetPos.sub(ballPos)
		const camPosition = ballPos.clone().sub(ballToPlanetVector.normalize().multiplyScalar(100))

		this.orbitControls.target = ballPos // or planetPos
		this.position.copy(camPosition)
		this.lookAt(ballPos);
	}
}
