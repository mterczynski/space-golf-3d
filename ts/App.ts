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
import { launchBall } from './utils/launchBall';
import { settings } from './settings';
import _ = require('lodash');

export class App {
	private readonly renderer = new WebGLRenderer({
		antialias: true,
		canvas: document.getElementById('mainCanvas') as HTMLCanvasElement,
	});
	private readonly scene = new Scene();
	private readonly orbitCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, Math.pow(10, 6));
	private readonly eGetter = new ElementGetter(this.scene);
	private balls: Ball[] = [new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball(),new Ball()];
	private activeCamera: Camera = this.orbitCamera;
	private stats = Stats();
	private readonly clock = new Clock();

	private setup = {
		planets: () => {
			const planets = [
				new Planet({radius: 33}),
				new Planet({radius: 20, color: new Color('rgb(0, 255, 0)')}),
				new Planet({radius: 100, color: new Color('rgb(0, 0, 255)')}),
				new Planet({radius: 3, color: new Color('rgb(255, 255, 255)')}),
			];

			planets.forEach(planet => {
				this.scene.add(planet);
			});

			planets[1].position.set(90, 10, 10);
			planets[2].position.set(0, 0, 200);
			planets[3].position.set(30, 30, 100);
		},
		ball: () => {

			this.balls.forEach(ball => {
				this.scene.add(ball);
				// todo - verify that ball is not intersecting or insideany planet
				const position = new Vector3(_.random(-500, 500), _.random(-500, 500), _.random(-500, 500));
				ball.position.set(position.x, position.y, position.z);
			});
			// this.scene.add(this.ball);
		},
		light: () => {
			const light = new PointLight();
			light.position.set(0, 100, 5000);
			this.scene.add(light);
		},
		camera: () => {
			this.orbitCamera.position.set(400, 200, 40);
			this.orbitCamera.lookAt(new Vector3());
		},
		skybox: () => this.scene.add(new Skybox()),
		orbitControls: () => new OrbitControls(this.orbitCamera, this.renderer.domElement),
		keyListeners: () => {
			// addEventListener('keydown', ({key}) => {
			// 	if(['Enter', ' '].includes(key) && this.ball.isOnPlanet) {
			// 		launchBall(this.ball);
			// 	}
			// })
		}
	};

	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.orbitCamera.aspect = innerWidth / innerHeight;
		this.orbitCamera.updateProjectionMatrix();
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

		// update ball's velocity by planets gravity:
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

		this.adjustCanvasSize();
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
		this.setup.keyListeners();
		this.onNewAnimationFrame();
		if(settings.showFPSCounter) {
			document.body.appendChild(this.stats.dom);
		}
	}
}
