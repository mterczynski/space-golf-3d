import { BackSide, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshToonMaterial, SphereGeometry, TextureLoader } from 'three';
import { settings } from '../settings';
import _ from 'lodash'

function createBorderMesh(planetRadius: number) {
	const borderMaterial = new MeshBasicMaterial({
		color: 'rgb(0,0,0)',
		side: BackSide,
	});

	const widthSegments = 32;
	const heightSegments = 32;
	const borderThickness = 1;

	return new Mesh(
		new SphereGeometry(
			planetRadius + borderThickness,
			widthSegments,
			heightSegments
		),
		borderMaterial
	);
}

function getRandomTextureUrl() {
	const logos = [
		'ksborek.jfif',
		'legia.jpg',
		'puszcza.png',
		'zaglebie.jfif',
	]

	const logo = _.sample(logos)

	return `${document.baseURI}/assets/gfx/clubs/${logo}`;
	// return `public/assets/gfx/clubs/legia.jpg`;
}

export class Planet extends Mesh {
	get mass() {
		// https://en.wikipedia.org/wiki/Sphere#Enclosed_volume
		const sphereVolumeMultiplier = Math.PI * 4 / 3;

		return this.density * (this.radius ** 3) * sphereVolumeMultiplier;
	}

	readonly radius: number;
	readonly density: number;

	constructor({ radius, color = 'rgb(255,0,0)', density = settings.defaultPlanetDensity }: {
		radius: number,
		density?: number
		color?: string
	}) {
		super(new SphereGeometry(radius, 32, 32), new MeshPhongMaterial({}));
		this.radius = radius;
		this.density = density;
		this.add(createBorderMesh(radius));

		this.init();
	}

	async init() {
		const textureLoader = new TextureLoader();
		const texture = await textureLoader.loadAsync(getRandomTextureUrl());

		if (this.material instanceof MeshPhongMaterial) {
			this.material.map = texture
		} else {
			throw new Error('Invalid material instance');
		}
	}
}
