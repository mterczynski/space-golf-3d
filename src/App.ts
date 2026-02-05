import { Clock, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { ElementGetter } from "./ElementGetter";
import { InfoTab } from "./InfoTab";
import { AimCamera } from "./cameras/AimCamera";
import { DistantCameras } from "./cameras/DistantCameras";
import { LandedBallTopDownCamera } from "./cameras/LandedBallTopDownCamera";
import { Ball } from "./meshes/Ball";
import { Planet } from "./meshes/Planet";
import { SphereSkybox } from "./meshes/SphereSkybox";
import { settings } from "./settings";
import { areSpheresColliding, calcGravityForce, calcVelocityAfterRebound as calcVelocityAfterBounce } from "./utils";
import { adjustBallPositionAfterCollision } from "./utils/adjustBallPositionAfterCollision";
import { createTestLevel } from "./utils/createTestLevel";
import { launchBall } from "./utils/launchBall";
import { playSound } from "./utils/playSound";
import { generateRandomLevel } from "./utils/generateRandomLevel";
import { Skybox } from "./meshes/Skybox";
import { ProceduralSkybox } from "./meshes/ProceduralSkybox";
import { SkyboxType } from "./types/SkyboxType";

export class App {
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
	private activeCamera: PerspectiveCamera = this.cameras.autoRotatingOrbit; // todo - use this.manualOrbitCamera for flight

	private readonly eGetter = new ElementGetter(this.scene);
	private readonly clock = new Clock();
	private readonly level = settings.useRandomLevel ? generateRandomLevel() : createTestLevel();
	private balls: Ball[] = [];
	private accumulatedTime = 0;
	private skybox!: SphereSkybox | Skybox | ProceduralSkybox;

	// @ts-expect-error - Stats type issue
	private stats = Stats();

	private setup = {
		level: () => {
			this.level.planets.forEach((planet) => {
				const planetInstance = new Planet({
					radius: planet.radius,
					color: planet.color,
					textureUrl: planet.textureUrl,
				});
				planetInstance.position.set(planet.position.x, planet.position.y, planet.position.z);
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
			// Find and set the initial landed planet
			const planets = this.eGetter.getPlanets();
			planets.forEach((planet) => {
				if (areSpheresColliding(planet, ball)) {
					ball.landedPlanet = planet;
				}
			});		},
		light: () => {
			const light = new PointLight(0xffffff, 50_000_000);
			light.position.set(0, 100, 5000);
			this.scene.add(light);
		},
		sound: () => {
			this.addListeners(() => playSound.ambient(), true);
		},
		cameraLock: () => {
			this.addListeners(() => this.cameras.aim.setupLockControls(), false);
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
			// this.scene.add(this.cameras.aim.getControlsObject())
		},
		skybox: () => {
			if (settings.skybox.type === SkyboxType.SPHERE) {
				this.skybox = new SphereSkybox();
			} else if (settings.skybox.type === SkyboxType.BOX) {
				this.skybox = new Skybox();
			} else {
				this.skybox = new ProceduralSkybox();
			}
			this.scene.add(this.skybox);
		},
		orbitControls: () => {
			new OrbitControls(this.cameras.staticManualOrbit, this.renderer.domElement);
		},
		listeners: () => {
			if (!settings.simulationMode) {
				addEventListener("keypress", (event) => {
					if (event.key === " ") {
						const ball = this.getCurrentBall();
						if (ball.landedPlanet) {
							const directionVector = this.getCurrentBall().position.clone().sub(this.cameras.aim.position.clone());
							const planets = this.eGetter.getPlanets();
							launchBall(ball, directionVector, planets);
							this.activeCamera = this.cameras.autoRotatingOrbit;
						}
					}
				});
			}
		},
	};

	private addListeners(callback: () => void, shouldExecuteOnce: boolean) {
		const events = ["mousedown", "keypress", "touchstart"];

		const onUserInteraction = () => {
			callback();
			if (shouldExecuteOnce) {
				events.forEach((interaction) => removeEventListener(interaction, onUserInteraction));
			}
		};

		events.forEach((interaction) => addEventListener(interaction, onUserInteraction));
	}

	// to be changed for multiplayer mode with multiple balls
	private getCurrentBall() {
		return this.balls[0];
	}

	private adjustRendererSize() {
		this.renderer.setSize(innerWidth, innerHeight);
	}

	private updateCameras() {
		const totalTimeElapsed = Date.now() - this.clock.getElapsedTime();
		this.activeCamera.aspect = innerWidth / innerHeight;
		this.activeCamera.updateProjectionMatrix();
		this.cameras.autoRotatingOrbit.lookAt(this.getCurrentBall().position);
		const autoRotatingOrbitCameraOffset = 2e3;
		const autoRotatingOrbitCameraSpeed = 0.000064 * settings.camera.rotationSpeed;
		this.cameras.autoRotatingOrbit.position.set(
			Math.sin(totalTimeElapsed * autoRotatingOrbitCameraSpeed) * autoRotatingOrbitCameraOffset,
			Math.abs(Math.cos(totalTimeElapsed * autoRotatingOrbitCameraSpeed) * autoRotatingOrbitCameraOffset),
			Math.cos(totalTimeElapsed * autoRotatingOrbitCameraSpeed) * autoRotatingOrbitCameraOffset
		);
		this.cameras.distant.update(this.getCurrentBall().position);
	}

	private updateBalls(timeDelta: number) {
		const planets = this.eGetter.getPlanets();
		const fixedTimeDelta = 1 / settings.ticksPerSecond;

		// Accumulate real time and update physics at fixed intervals
		this.accumulatedTime += timeDelta;

		// Skip real-time physics when using pre-calculated flight
		if (!settings.usePreCalculatedFlight) {
			// Process all accumulated physics steps
			while (this.accumulatedTime >= fixedTimeDelta) {
				this.bounceBallsOffPlanets(planets);
				this.gravitateBalls(fixedTimeDelta);
				this.accumulatedTime -= fixedTimeDelta;
			}
		}

		this.balls.forEach((ball) => ball.tick(planets));
	}

	private bounceBallsOffPlanets(planets: Planet[]) {
		planets.forEach((planet) => {
			this.balls.forEach((ball) => {
				if (areSpheresColliding(planet, ball)) {
					const newVelocity = calcVelocityAfterBounce({
						staticSphere: planet,
						movingSphere: ball,
					});

					if (settings.simulationMode) {
						console.log(
							"## simulation",
							"hit",
							ball.position
								.toArray()
								.map((i) => Math.floor(i))
								.toString()
						);
					}

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
				ball.addVelocity(calcGravityForce({ puller: planet, pulled: ball, timeDelta }));
			});
		});
	}

	private stopBall(ball: Ball, planet: Planet) {
		ball.landedPlanet = planet;
		if (!settings.simulationMode) {
			this.activeCamera = this.cameras.landedBallTopDown;
			this.cameras.landedBallTopDown.reset(ball);
			this.cameras.aim.reset(ball);
			setTimeout(() => {
				this.activeCamera = this.cameras.aim;
			}, 1000);
		}
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
		// Only update skybox if it has an update method (ProceduralSkybox)
		if (this.skybox instanceof ProceduralSkybox) {
			this.skybox.update(delta);
		}
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
		this.setup.cameraLock();
		this.onNewAnimationFrame();
		if (settings.showFPSCounter) {
			document.body.appendChild(this.stats.dom);
		}
	}
}
