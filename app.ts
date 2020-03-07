import { Camera, Color, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Ball } from './ts/Ball';
import { ElementGetter } from './ts/ElementGetter';
import { InfoTab } from './ts/InfoTab';
import { Planet } from './ts/Planet';
import { SettingsTab } from './ts/SettingsTab';
import { Skybox } from './ts/Skybox';

class App {

	private readonly settingsTab = new SettingsTab();
	private readonly renderer = new WebGLRenderer({
		antialias: true,
		canvas: document.getElementById('mainCanvas') as HTMLCanvasElement,
	});
	private readonly scene = new Scene();
	private readonly orbitCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, Math.pow(10, 6));
	private readonly eGetter = new ElementGetter(this.scene);
	private ball: Ball = new Ball(this.settingsTab);
	private activeCamera: Camera = this.orbitCamera;

	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.orbitCamera.aspect = innerWidth / innerHeight;
		this.orbitCamera.updateProjectionMatrix();
	}

	private render() {
		this.renderer.render(this.scene, this.activeCamera);

		requestAnimationFrame(this.render.bind(this));
		this.adjustCanvasSize();

		const planets: Planet[] = this.eGetter.getPlanets();

		planets.forEach((planet: Planet) => {
			this.ball.addVelocity(planet.calcGravity(this.ball));
		});

		this.ball.tick();

		this.eGetter.getLines().forEach(line => this.scene.remove(line));

		this.scene.add(this.ball.getLine());

		InfoTab.updateText(this.ball);
	}

	constructor() {
		// tslint:disable-next-line:no-unused-expression
		new OrbitControls(this.orbitCamera, this.renderer.domElement);

		const planets = [
			new Planet(40, this.settingsTab),
			new Planet(20, this.settingsTab, new Color('rgb(0, 255, 0)')),
			new Planet(100, this.settingsTab, new Color('rgb(0, 0, 255)')),
			new Planet(3, this.settingsTab, new Color('rgb(255, 255, 255)')),
		];

		planets.forEach(planet => {
			this.scene.add(planet);
		});

		planets[3].position.set(100, 100, 100);
		planets[1].position.set(90, 10, 10);
		planets[2].position.set(0, 0, 500);

		this.ball.position.set(0, -100, -70);
		this.scene.add(this.ball);

		this.orbitCamera.position.set(200, 200, 200);
		this.orbitCamera.lookAt(new Vector3());

		this.scene.add(new Skybox());
		const light = new PointLight();
		light.position.set(0, 100, 5000);
		this.scene.add(light);

		this.render();
	}
}

// tslint:disable-next-line:no-unused-expression
new App();
