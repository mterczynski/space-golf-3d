import { BackSide, BoxGeometry, ImageUtils, Mesh, MeshBasicMaterial } from 'three';
import { settings } from '../settings';

function buildSkyboxUrl(part: number) {
	return `${document.baseURI}assets/skybox/sky${part}.png`;
}

export class Skybox extends Mesh {
	constructor() {
		const materials = [
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(4)), opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(2)), opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(1)), opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(6)), opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(3)), opacity: settings.skyboxOpacity, transparent: true, }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(5)), opacity: settings.skyboxOpacity, transparent: true, }),
		];
		const skyboxWidth = 10 ** 5;
		const geometry = new BoxGeometry(skyboxWidth, skyboxWidth, skyboxWidth);

		super(geometry, materials);
	}
}
