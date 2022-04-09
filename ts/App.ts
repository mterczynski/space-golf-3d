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

export class App {
	private readonly renderer = new WebGLRenderer({
		antialias: true,
		canvas: document.getElementById('mainCanvas') as HTMLCanvasElement,
	});
	private readonly scene = new Scene();
	private readonly orbitCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, Math.pow(10, 6));
	private readonly eGetter = new ElementGetter(this.scene);
	private ball: Ball = new Ball();
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
			this.ball.position.set(0, -100, -70);
			this.scene.add(this.ball);
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
			addEventListener('keydown', ({key}) => {
				if(['Enter', ' '].includes(key) && this.ball.isOnPlanet) {
					launchBall(this.ball);
				}
			})
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
			if(areSpheresColliding(planet, this.ball)) {
				console.log('spheres are colliding', JSON.stringify(planet.position), JSON.stringify(this.ball.position), Date.now());
				const newVelocity = calcVelocityAfterRebound({
					staticSphere: planet,
					movingSphere: this.ball,
				});

				this.ball.velocity = newVelocity;
				adjustBallPositionAfterCollision(this.ball, planet);
				if(this.ball.velocity.length() < 0.2) {
					this.ball.isOnPlanet = true;
				}
			}
		});

		// update ball's velocity by planets gravity:
		planets.forEach((planet: Planet) => {
			this.ball.addVelocity(calcGravityForce({puller: planet, pulled: this.ball, timeDelta}));
		});

		this.ball.tick();
	}

	private updateBallTrace() {
		this.eGetter.getLines().forEach(line => this.scene.remove(line));

		this.scene.add(this.ball.createTrace());
	}

	private onNewAnimationFrame() {
		const delta = this.clock.getDelta();
		this.renderer.render(this.scene, this.activeCamera);
		this.stats.update();

		this.adjustCanvasSize();
		this.updateBall(delta);
		this.updateBallTrace();
		InfoTab.updateText(this.ball);

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
		document.body.appendChild(this.stats.dom);
	}
}
