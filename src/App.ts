import { Camera, Clock, Color, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Ball } from './meshes/Ball';
import { ElementGetter } from './ElementGetter';
import { InfoTab } from './InfoTab';
import { Planet } from './meshes/Planet';
import { Skybox } from './meshes/Skybox';
import { areSpheresColliding, calcVelocityAfterRebound, calcGravityForce } from './utils';
import Stats from 'three/examples/jsm/libs/stats.module'
import { adjustBallPositionAfterCollision } from './utils/adjustBallPositionAfterCollision';
import { settings } from './settings';
import { generateRandomLevel } from './utils/generateRandomLevel';
import { DistantCameras } from './DistantCameras';
import { SoundName, playSound } from './utils/playSound';

export class App {
	private readonly startDate = Date.now();
	private readonly renderer = new WebGLRenderer({
		antialias: true,
		canvas: document.getElementById('mainCanvas') as HTMLCanvasElement,
	});
	private readonly scene = new Scene();
	private readonly manualOrbitCamera = new PerspectiveCamera(settings.cameraFov, innerWidth / innerHeight, 0.1, Math.pow(10, 6));
	private readonly autoRotatingOrbitCamera = new PerspectiveCamera(settings.cameraFov, innerWidth / innerHeight, 0.1, Math.pow(10, 6))
	private readonly eGetter = new ElementGetter(this.scene);
	private readonly clock = new Clock();
	private readonly level = generateRandomLevel();
	private readonly distantCameras = new DistantCameras();
	private balls: Ball[] = [];
	private activeCamera: PerspectiveCamera = this.autoRotatingOrbitCamera;
	private stats = Stats();

	private setup = {
		level: () => {
			this.level.planets.forEach(planet => {
				const planetInstance = new Planet({ radius: planet.radius, color: planet.color });
				planetInstance.position.set(planet.position.x, planet.position.y, planet.position.z);
				this.scene.add(planetInstance);
			});

			const ball = new Ball();
			ball.position.set(
				this.level.initialBallPosition.x,
				this.level.initialBallPosition.y,
				this.level.initialBallPosition.z,
			);
			this.balls.push(ball);
			this.scene.add(ball);
		},
		light: () => {
			const light = new PointLight(0xFFFFFF,100_000_000);
			light.position.set(0, 100, 5000);
			this.scene.add(light);
		},
		cameras: () => {
			this.manualOrbitCamera.position.set(400, 200, 40);
			this.manualOrbitCamera.lookAt(new Vector3());
			this.autoRotatingOrbitCamera.position.set(600, 0, 0);
			this.autoRotatingOrbitCamera.lookAt(new Vector3());
			this.scene.add(this.distantCameras);
		},
		skybox: () => this.scene.add(new Skybox()),
		orbitControls: () => new OrbitControls(this.manualOrbitCamera, this.renderer.domElement),
	};

	private adjustRendererSize() {
		this.renderer.setSize(innerWidth, innerHeight);
	}

	private updateCameras() {
		const totalTimeElapsed = Date.now() - this.startDate;
		this.activeCamera.aspect = innerWidth / innerHeight;
		this.activeCamera.updateProjectionMatrix();
		this.autoRotatingOrbitCamera.lookAt(this.balls[0].position);
		const autoRotatingOrbitCameraOffset = 2e3;
		const autoRotatingOrbitCameraSpeed = 0.000064;
		this.autoRotatingOrbitCamera.position.set(
			Math.sin(totalTimeElapsed * autoRotatingOrbitCameraSpeed) * autoRotatingOrbitCameraOffset,
			Math.abs(Math.cos(totalTimeElapsed * autoRotatingOrbitCameraSpeed) * autoRotatingOrbitCameraOffset),
			Math.cos(totalTimeElapsed * autoRotatingOrbitCameraSpeed) * autoRotatingOrbitCameraOffset
		);
		this.distantCameras.update(this.balls[0].position);
	}

	private updateBall(timeDelta: number) {
		const planets = this.eGetter.getPlanets();

		// bounce ball off planets
		planets.forEach(planet => {
			this.balls.forEach(ball => {
				if (areSpheresColliding(planet, ball)) {
					const newVelocity = calcVelocityAfterRebound({
						staticSphere: planet,
						movingSphere: ball,
					});

					const hitVolume = Math.min(1, ball.velocity.length() / 5)
					playSound.ballHit(hitVolume)

					ball.velocity = newVelocity;
					adjustBallPositionAfterCollision(ball, planet);
					if (ball.velocity.length() < 0.2) {
						ball.isOnPlanet = true;
					}
				}
			});
		});

		// update velocity of balls by gravity of planets:
		planets.forEach((planet: Planet) => {
			this.balls.forEach(ball => {
				ball.addVelocity(calcGravityForce({ puller: planet, pulled: ball, timeDelta }));
			});
		});

		this.balls.forEach(ball => {
			ball.tick();
		})
	}

	private updateBallTrace() {
		this.eGetter.getLines().forEach(line => this.scene.remove(line));

		this.balls.forEach(ball => {
			this.scene.add(ball.createTrace());
		});
	}

	private onNewAnimationFrame() {
		const delta = this.clock.getDelta();
		this.renderer.render(this.scene, this.activeCamera);
		this.stats.update();

		this.adjustRendererSize();
		this.updateCameras();
		this.updateBall(delta);
		this.updateBallTrace();
		InfoTab.updateText(this.balls[0]);

		requestAnimationFrame(this.onNewAnimationFrame.bind(this));
	}

	constructor() {
		this.setup.orbitControls();
		this.setup.level();
		this.setup.light();
		this.setup.cameras();
		this.setup.skybox();
		this.onNewAnimationFrame();
		if (settings.showFPSCounter) {
			document.body.appendChild(this.stats.dom);
		}
	}
}
