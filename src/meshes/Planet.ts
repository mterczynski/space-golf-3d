import {
	BackSide,
	Mesh,
	MeshBasicMaterial,
	MeshPhongMaterial,
	SphereGeometry,
	TextureLoader,
} from "three";
import { settings } from "../settings";

// Shared texture loader instance for better performance and caching
const textureLoader = new TextureLoader();

function createBorderMesh(planetRadius: number) {
	const borderMaterial = new MeshBasicMaterial({
		color: "rgb(0,0,0)",
		side: BackSide,
	});

	const widthSegments = 32;
	const heightSegments = 32;
	const borderThickness = settings.planet.borderThickness;

	return new Mesh(new SphereGeometry(planetRadius + borderThickness, widthSegments, heightSegments), borderMaterial);
}

export class Planet extends Mesh {
	get mass() {
		// https://en.wikipedia.org/wiki/Sphere#Enclosed_volume
		const sphereVolumeMultiplier = (Math.PI * 4) / 3;

		return this.density * this.radius ** 3 * sphereVolumeMultiplier;
	}

	readonly radius: number;
	readonly density: number;

	constructor({
		radius,
		color = "rgb(255,0,0)",
		density = settings.planet.defaultDensity,
		textureUrl,
	}: {
		radius: number;
		density?: number;
		color?: string;
		textureUrl?: string;
	}) {
		super(new SphereGeometry(radius, 32, 32), new MeshPhongMaterial({ color }));
		this.radius = radius;
		this.density = density;
		this.add(createBorderMesh(radius));

		if (textureUrl) {
			// Note: Textures are loaded asynchronously for this PoC.
			// This may cause a brief visual flash as planets initially render with their color
			// before the texture loads. For production, consider preloading textures or implementing
			// a loading strategy.
			this.loadTexture(textureUrl);
		}
	}

	private async loadTexture(textureUrl: string) {
		try {
			const texture = await textureLoader.loadAsync(textureUrl);
			(this.material as MeshPhongMaterial).map = texture;
			(this.material as MeshPhongMaterial).needsUpdate = true;
		} catch (error) {
			console.warn(`Failed to load planet texture from ${textureUrl}:`, error);
			// Planet will continue to use its color fallback
		}
	}
}
