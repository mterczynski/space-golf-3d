import { BackSide, BoxGeometry, TextureLoader, ImageUtils, Mesh, MeshBasicMaterial, SphereGeometry, DoubleSide, MeshLambertMaterial, MeshPhongMaterial, Color } from 'three';
import { settings } from '../settings';

export class SphereSkybox extends Mesh {
	constructor() {
		super(new BoxGeometry(), []);
		this.init()
	}

	async init() {
		const textureLoader = new TextureLoader();
		const texture = await textureLoader.loadAsync(`${document.baseURI}assets/gfx/sphere-skybox.jpg`)
		const material = new MeshBasicMaterial({
			side: DoubleSide, map: texture, opacity: settings.skyboxOpacity, transparent: true,
			color: new Color(0.15, 0.2, 0.4)
		})
		const skyboxWidth = 10 ** 5.8;
		const geometry = new SphereGeometry(skyboxWidth);

		this.geometry = geometry
		this.material = material
	}
}
