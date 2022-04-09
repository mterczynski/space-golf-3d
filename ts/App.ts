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
import _ = require('lodash');

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
	private balls: Ball[] = [new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball()];
	private activeCamera: PerspectiveCamera = this.autoRotatingOrbitCamera;
	private stats = Stats();
	private readonly clock = new Clock();

	private setup = {
		planets: () => {
			const planets = [
				new Planet({radius: 33, color: 'rgb(255, 0, 0)'}),
				new Planet({radius: 20, color: 'rgb(0, 255, 0)'}),
				new Planet({radius: 100, color: 'rgb(0, 0, 255)'}),
				new Planet({radius: 60, color: 'rgb(255, 255, 255)'}),
			];

			planets.forEach(planet => {
				this.scene.add(planet);
			});

			planets[0].position.set(0, 230, 50);
			planets[1].position.set(300, -100, 10);
			planets[2].position.set(0, 0, 0);
			planets[3].position.set(300, -240, 90);
		},
		ball: () => {

			this.balls.forEach(ball => {
				this.scene.add(ball);
				// todo - verify that ball is not intersecting or inside any planet
				const position = new Vector3(_.random(-500, 500), _.random(-500, 500), _.random(-500, 500));
				ball.position.set(position.x, position.y, position.z);
			});
		},
		light: () => {
			const light = new PointLight();
			light.position.set(0, 100, 5000);
			this.scene.add(light);
		},
		camera: () => {
			this.manualOrbitCamera.position.set(400, 200, 40);
			this.manualOrbitCamera.lookAt(new Vector3());
			this.autoRotatingOrbitCamera.position.set(600, 0, 0);
			this.autoRotatingOrbitCamera.lookAt(new Vector3());
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
		this.autoRotatingOrbitCamera.lookAt(new Vector3());
		this.autoRotatingOrbitCamera.position.set(
			Math.sin(totalTimeElapsed/14000) * 1300,
			Math.abs(Math.cos(totalTimeElapsed/14000) * 1300),
			Math.cos(totalTimeElapsed/14000) * 1300
		);
	}

	private updateBall(timeDelta: number) {
		const planets = this.eGetter.getPlanets();

		// bounce ball off planets
		planets.forEach(planet => {
			this.balls.forEach(ball => {
				if(areSpheresColliding(planet, ball)) {
					const newVelocity = calcVelocityAfterRebound({
						staticSphere: planet,
						movingSphere: ball,
					});
	
					ball.velocity = newVelocity;
					adjustBallPositionAfterCollision(ball, planet);
					if(ball.velocity.length() < 0.2) {
						ball.isOnPlanet = true;
					}
				}
			});
		});

		// update velocity of balls by gravity of planets:
		planets.forEach((planet: Planet) => {
			this.balls.forEach(ball => {
				ball.addVelocity(calcGravityForce({puller: planet, pulled: ball, timeDelta}));
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
		this.setup.planets();
		this.setup.ball();
		this.setup.light();
		this.setup.camera();
		this.setup.skybox();
		this.onNewAnimationFrame();
		if(settings.showFPSCounter) {
			document.body.appendChild(this.stats.dom);
		}
	}
}
