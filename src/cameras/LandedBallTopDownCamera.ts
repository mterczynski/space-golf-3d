import { PerspectiveCamera, Vector3 } from "three";
import { settings } from "../settings";
import { Ball } from "../meshes/Ball";
import { OrbitControls } from "three-orbitcontrols-ts";

export class LandedBallTopDownCamera extends PerspectiveCamera {
	private readonly orbitControls: OrbitControls

	constructor(domElement: HTMLElement) {
		super(settings.cameraFov, innerWidth / innerHeight, 0.1, Math.pow(10, 6))

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
		const camPosition = ballPos.clone().sub(ballToPlanetVector.normalize().multiplyScalar(2000))

		this.orbitControls.target = ballPos // or planetPos
		this.position.copy(camPosition)
		this.lookAt(ballPos);
	}
}