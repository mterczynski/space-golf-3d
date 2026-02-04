import _ from "lodash";

const PLANET_TEXTURE_COUNT = 14; // 1.jpg through 14.jpg

export function getRandomPlanetTexture(): string {
	const textureNumber = _.random(1, PLANET_TEXTURE_COUNT);
	return getPlanetTexture(textureNumber);
}

export function getPlanetTexture(textureNumber: number): string {
	return `${document.baseURI}assets/gfx/planets/${textureNumber}.jpg`;
}
