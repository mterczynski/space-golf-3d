import { BackSide, BoxGeometry, Mesh, MeshBasicMaterial, TextureLoader } from 'three';
import { settings } from '../settings';

function buildSkyboxUrl(part: number) {
	return `${document.baseURI}public/assets/gfx/box-skybox/sky${part}.png`;
}

export class Skybox extends Mesh {
	constructor() {
		super(new BoxGeometry(), []);

		this.init()
	}

	async init() {
		const textureLoader = new TextureLoader();

		const textures = await Promise.all([
			textureLoader.loadAsync(buildSkyboxUrl(1)),
			textureLoader.loadAsync(buildSkyboxUrl(2)),
			textureLoader.loadAsync(buildSkyboxUrl(3)),
			textureLoader.loadAsync(buildSkyboxUrl(4)),
			textureLoader.loadAsync(buildSkyboxUrl(5)),
			textureLoader.loadAsync(buildSkyboxUrl(6))
		])

		const materials = [
			new MeshBasicMaterial({ side: BackSide, map: textures[3], opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: textures[1], opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: textures[0], opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: textures[5], opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: textures[2], opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: textures[4], opacity: settings.skyboxOpacity, transparent: true, }),
		];
		const skyboxWidth = 10 ** 5;
		const geometry = new BoxGeometry(skyboxWidth, skyboxWidth, skyboxWidth);

		this.geometry = geometry
		this.material = materials
	}
}
