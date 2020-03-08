import { Camera, Color, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Ball } from './meshes/Ball';
import { ElementGetter } from './ElementGetter';
import { InfoTab } from './InfoTab';
import { Planet } from './meshes/Planet';
import { Skybox } from './meshes/Skybox';

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

			planets[3].position.set(100, 100, 100);
			planets[1].position.set(90, 10, 10);
			planets[2].position.set(0, 0, 500);
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
			this.orbitCamera.position.set(200, 200, 200);
			this.orbitCamera.lookAt(new Vector3());
		},
		skybox: () => this.scene.add(new Skybox()),
		orbitControls: () => new OrbitControls(this.orbitCamera, this.renderer.domElement),
	}

	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.orbitCamera.aspect = innerWidth / innerHeight;
		this.orbitCamera.updateProjectionMatrix();
	}

	private updateBall() {
		const planets: Planet[] = this.eGetter.getPlanets();

		planets.forEach((planet: Planet) => {
			this.ball.addVelocity(planet.calcGravity(this.ball));
		});

		this.ball.tick();
	}

	private updateBallTrace() {
		this.eGetter.getLines().forEach(line => this.scene.remove(line));

		this.scene.add(this.ball.getLine());
	}

	private onNewAnimationFrame() {
		this.renderer.render(this.scene, this.activeCamera);

		this.adjustCanvasSize();
		this.updateBall();
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

		this.onNewAnimationFrame();
	}
}
