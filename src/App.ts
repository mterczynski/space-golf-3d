import {
	Clock,
	PerspectiveCamera,
	PointLight,
	Scene,
	Vector3,
	WebGLRenderer,
} from "three";
import { OrbitControls } from "three-orbitcontrols-ts";
import Stats from "three/examples/jsm/libs/stats.module";
import { DistantCameras } from "./cameras/DistantCameras";
import { ElementGetter } from "./ElementGetter";
import { InfoTab } from "./InfoTab";
import { Ball } from "./meshes/Ball";
import { Planet } from "./meshes/Planet";
import { SphereSkybox } from "./meshes/SphereSkybox";
import { settings } from "./settings";
import {
	areSpheresColliding,
	calcGravityForce,
	calcVelocityAfterRebound as calcVelocityAfterBounce,
} from "./utils";
import { adjustBallPositionAfterCollision } from "./utils/adjustBallPositionAfterCollision";
import { generateRandomLevel } from "./utils/generateRandomLevel";
import { playSound } from "./utils/playSound";
import { LandedBallTopDownCamera } from "./cameras/LandedBallTopDownCamera";
import { AimCamera } from "./cameras/AimCamera";
import { launchBall } from "./utils/launchBall";

export class App {
	private readonly startDate = Date.now();
	private readonly renderer = new WebGLRenderer({
		antialias: true,
		canvas: document.getElementById("mainCanvas") as HTMLCanvasElement,
	});
	private readonly scene = new Scene();

	private cameras = {
		aim: new AimCamera(this.renderer.domElement),
		landedBallTopDown: new LandedBallTopDownCamera(this.renderer.domElement),
		staticManualOrbit: new PerspectiveCamera(
			settings.camera.fov,
			innerWidth / innerHeight,
			settings.camera.near,
			settings.camera.far
		),
		autoRotatingOrbit: new PerspectiveCamera(
			settings.camera.fov,
			innerWidth / innerHeight,
			settings.camera.near,
			settings.camera.far
		),
		distant: new DistantCameras(),
	};
	private activeCamera: PerspectiveCamera = this.cameras.aim; // todo - use this.manualOrbitCamera for flight

	private readonly eGetter = new ElementGetter(this.scene);
	private readonly clock = new Clock();
	private readonly level = generateRandomLevel();
	private balls: Ball[] = [];

	// @ts-ignore
	private stats = Stats();

	private setup = {
		level: () => {
			this.level.planets.forEach((planet) => {
				const planetInstance = new Planet({
					radius: planet.radius,
					color: planet.color,
				});
				planetInstance.position.set(
					planet.position.x,
					planet.position.y,
					planet.position.z
				);
				this.scene.add(planetInstance);
			});

			const ball = new Ball();
			ball.position.set(
				this.level.initialBallPosition.x,
				this.level.initialBallPosition.y,
				this.level.initialBallPosition.z
			);
			this.balls.push(ball);
			this.scene.add(ball);
		},
		light: () => {
			const light = new PointLight(0xffffff, 50_000_000);
			light.position.set(0, 100, 5000);
			this.scene.add(light);
		},
		sound: () => {
			const userInteractions = ["mousedown", "keypress", "touchstart"];
			const playSoundOnUserInteraction = () => {
				playSound.ambient();
				userInteractions.forEach((interaction) =>
					removeEventListener(interaction, playSoundOnUserInteraction)
				);
			};

			userInteractions.forEach((interaction) =>
				addEventListener(interaction, playSoundOnUserInteraction)
			);
		},
		cameras: () => {
			this.cameras.staticManualOrbit.position.set(400, 200, 40);
			this.cameras.staticManualOrbit.lookAt(new Vector3());
			this.cameras.autoRotatingOrbit.position.set(600, 0, 0);
			this.cameras.autoRotatingOrbit.lookAt(new Vector3());
			this.scene.add(this.cameras.distant);
			this.scene.add(this.cameras.staticManualOrbit);
			this.scene.add(this.cameras.landedBallTopDown);
			this.scene.add(this.cameras.aim);
		},
		// skybox: () => this.scene.add(new Skybox()),
		skybox: () => this.scene.add(new SphereSkybox()),
		orbitControls: () => {
			new OrbitControls(
				this.cameras.staticManualOrbit,
				this.renderer.domElement
			);
		},
		listeners: () => {
			addEventListener("keypress", (event) => {
				if (event.key === " ") {
					const ball = this.getCurrentBall();
					if (ball.landedPlanet) {
						const directionVector = this.getCurrentBall()
							.position.clone()
							.sub(this.cameras.aim.position.clone());

						launchBall(ball, directionVector);
						this.activeCamera = this.cameras.autoRotatingOrbit;
					}
				}
			});
		},
	};

	// to be changed for multiplayer mode with multiple balls
	private getCurrentBall() {
		return this.balls[0];
	}

	private adjustRendererSize() {
		this.renderer.setSize(innerWidth, innerHeight);
	}

	private updateCameras() {
		const totalTimeElapsed = Date.now() - this.startDate;
		this.activeCamera.aspect = innerWidth / innerHeight;
		this.activeCamera.updateProjectionMatrix();
		this.cameras.autoRotatingOrbit.lookAt(this.getCurrentBall().position);
		const autoRotatingOrbitCameraOffset = 2e3;
		const autoRotatingOrbitCameraSpeed = 0.000064;
		this.cameras.autoRotatingOrbit.position.set(
			Math.sin(totalTimeElapsed * autoRotatingOrbitCameraSpeed) *
			autoRotatingOrbitCameraOffset,
			Math.abs(
				Math.cos(totalTimeElapsed * autoRotatingOrbitCameraSpeed) *
				autoRotatingOrbitCameraOffset
			),
			Math.cos(totalTimeElapsed * autoRotatingOrbitCameraSpeed) *
			autoRotatingOrbitCameraOffset
		);
		this.cameras.distant.update(this.getCurrentBall().position);
	}

	private updateBalls(timeDelta: number) {
		const planets = this.eGetter.getPlanets();

		this.bounceBallsOffPlanets(planets);
		this.gravitateBalls(timeDelta);
		this.balls.forEach((ball) => ball.tick());
	}

	private bounceBallsOffPlanets(planets: Planet[]) {
		planets.forEach((planet) => {
			this.balls.forEach((ball) => {
				if (areSpheresColliding(planet, ball)) {
					const newVelocity = calcVelocityAfterBounce({
						staticSphere: planet,
						movingSphere: ball,
					});

					const hitSoundVolume = Math.min(1, ball.velocity.length() / 5);
					playSound.ballHit(hitSoundVolume);

					ball.velocity = newVelocity;
					adjustBallPositionAfterCollision(ball, planet);
					if (ball.velocity.length() < 0.2 && !ball.landedPlanet) {
						this.stopBall(ball, planet);
					}
				}
			});
		});
	}

	/**
	 * @description Updates velocity of balls by gravity of planets
	 */
	private gravitateBalls(timeDelta: number) {
		const planets = this.eGetter.getPlanets();

		planets.forEach((planet: Planet) => {
			this.balls.forEach((ball) => {
				ball.addVelocity(
					calcGravityForce({ puller: planet, pulled: ball, timeDelta })
				);
			});
		});
	}

	private stopBall(ball: Ball, planet: Planet) {
		ball.landedPlanet = planet;
		this.activeCamera = this.cameras.aim;
		this.cameras.landedBallTopDown.reset(ball);
		this.cameras.aim.reset(ball);
	}

	private updateBallTrace() {
		this.eGetter.getLines().forEach((line) => this.scene.remove(line));

		this.balls.forEach((ball) => {
			this.scene.add(ball.createTrace());
		});
	}

	private onNewAnimationFrame() {
		const delta = this.clock.getDelta();
		this.renderer.render(this.scene, this.activeCamera);
		this.stats.update();

		this.adjustRendererSize();
		this.updateCameras();
		this.updateBalls(delta);
		this.updateBallTrace();
		InfoTab.updateText(this.getCurrentBall());

		requestAnimationFrame(this.onNewAnimationFrame.bind(this));
	}

	constructor() {
		this.setup.orbitControls();
		this.setup.level();
		this.setup.light();
		this.setup.cameras();
		this.setup.skybox();
		this.setup.listeners();
		this.setup.sound();
		this.onNewAnimationFrame();
		if (settings.showFPSCounter) {
			document.body.appendChild(this.stats.dom);
		}
	}
}
