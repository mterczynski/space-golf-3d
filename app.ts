import { Planet } from './ts/Planet';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Ball } from './ts/Ball';
import { Color, Vector3, WebGLRenderer, Scene, PerspectiveCamera, PointLight, Camera } from 'three';
import { ElementGetter } from './ts/ElementGetter';
import { InfoTab } from './ts/InfoTab';
import { Skybox } from './ts/Skybox';
import { SettingsTab } from './ts/SettingsTab';

const AnaglyphEffect = require('three-anaglypheffect'); // no ts definition

class App {
	constructor() {
		new OrbitControls(this.orbitCamera, this.renderer.domElement);

		const planets = [
			new Planet(40, this.settingsTab),
			new Planet(20, this.settingsTab, new Color('rgb(0, 255, 0)')),
			new Planet(100, this.settingsTab, new Color('rgb(0, 0, 255)')),
			new Planet(3, this.settingsTab, new Color('rgb(255, 255, 255)'))
		];

		planets.forEach((planet) => {
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
		let light = new PointLight();
		light.position.set(0, 100, 5000);
		this.scene.add(light);

		this.render();
	}

	private readonly settingsTab = new SettingsTab();
	private readonly renderer = new WebGLRenderer({
		antialias: true,
		canvas: <HTMLCanvasElement>document.getElementById('mainCanvas')
	});
	private readonly scene = new Scene();
	private readonly orbitCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, Math.pow(10, 6));
	private readonly eGetter = new ElementGetter(this.scene);
	private ball: Ball = new Ball(this.settingsTab);
	private effectAnaglyphic = new AnaglyphEffect(this.renderer, 2000, innerWidth, innerHeight);
	private activeCamera: Camera = this.orbitCamera
	// Example mesh

	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.orbitCamera.aspect = innerWidth / innerHeight;
		this.orbitCamera.updateProjectionMatrix();
	}

	private render() {
		if (this.settingsTab.getSettings().anaglyphEffect) {
			this.effectAnaglyphic.render(this.scene, this.activeCamera);
		} else {
			this.renderer.render(this.scene, this.activeCamera);
		}

		requestAnimationFrame(this.render.bind(this));
		this.adjustCanvasSize();

		let planets: Planet[] = this.eGetter.getPlanets();

		planets.forEach((planet: Planet) => {
			this.ball.addVelocity(planet.calcGravity(this.ball));
		});

		this.ball.tick();

		this.eGetter.getLines().forEach((line) => {
			this.scene.remove(line);
		});

		this.scene.add(this.ball.getLine());

		InfoTab.updateText(this.ball);
	}
}

new App();
