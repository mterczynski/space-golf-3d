import { BackSide, BoxGeometry, ImageUtils, Mesh, MeshBasicMaterial } from 'three';

function buildSkyboxUrl(part: number) {
	return `${document.baseURI}assets/skybox/sky${part}.png`;
}

export class Skybox {
	mesh;

	constructor() {
		const materials = [
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(4)) }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(2)) }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(1)) }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(6)) }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(3)) }),
			new MeshBasicMaterial({ side: BackSide, map: ImageUtils.loadTexture(buildSkyboxUrl(5)) }),
		];
		const skyboxWidth = 10 ** 5;
		const geometry = new BoxGeometry(skyboxWidth, skyboxWidth, skyboxWidth);

		this.mesh = new Mesh(geometry, materials);
	}
}
