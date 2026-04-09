import {
	SphereGeometry,
	Mesh,
	MeshBasicMaterial,
	BackSide,
	Color,
	BufferGeometry,
	PointsMaterial,
	Points,
	BufferAttribute,
	AdditiveBlending,
	PointLight,
	Group,
} from "three";
import { settings } from "../settings";

export class ProceduralSkybox extends Group {
	// Skybox radius - using 10^5.8 to match the scale of the game world
	// This ensures the skybox encompasses all game objects while remaining performant
	private static readonly SKYBOX_RADIUS_EXPONENT = 5.8;

	// Sun animation parameters
	private static readonly SUN_PULSE_SPEED = 2; // Oscillations per second
	private static readonly SUN_MIN_INTENSITY = 0.2;
	private static readonly SUN_MAX_INTENSITY = 0.5;

	private sun!: PointLight;
	private sunMesh!: Mesh;
	private animationTime: number = 0;

	constructor() {
		super();
		this.init();
	}

	init() {
		// Create background sphere with gradient
		const skyboxRadius = 10 ** ProceduralSkybox.SKYBOX_RADIUS_EXPONENT;
		const skyGeometry = new SphereGeometry(skyboxRadius, 64, 64);

		// Create gradient material - darker at top, lighter at horizon
		const skyMaterial = new MeshBasicMaterial({
			side: BackSide,
			color: new Color(0, 0, 0.015), // Red background
			opacity: settings.skybox.opacity,
			transparent: true,
		});

		const skyMesh = new Mesh(skyGeometry, skyMaterial);
		this.add(skyMesh);

		// Create star field
		this.createStarField(skyboxRadius * 0.95);

		// Create distant sun
		this.createSun(skyboxRadius * 0.9);
	}

	private createStarField(radius: number) {
		const starCount = 3000;
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);
		const sizes = new Float32Array(starCount);

		for (let i = 0; i < starCount; i++) {
			// Random position on sphere
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);

			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);

			positions[i * 3] = x;
			positions[i * 3 + 1] = y;
			positions[i * 3 + 2] = z;

			// Varying star colors - whites, blues, and slight yellows
			const colorVariation = Math.random();
			if (colorVariation < 0.7) {
				// White stars
				colors[i * 3] = 0.9 + Math.random() * 0.1;
				colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
				colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
			} else if (colorVariation < 0.85) {
				// Blue stars
				colors[i * 3] = 0.7 + Math.random() * 0.2;
				colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
				colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
			} else {
				// Slight yellow stars
				colors[i * 3] = 0.9 + Math.random() * 0.1;
				colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
				colors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
			}

			// Varying sizes for depth perception
			sizes[i] = Math.random() * 3 + 0.5;
		}

		const starsGeometry = new BufferGeometry();
		starsGeometry.setAttribute("position", new BufferAttribute(positions, 3));
		starsGeometry.setAttribute("color", new BufferAttribute(colors, 3));
		starsGeometry.setAttribute("size", new BufferAttribute(sizes, 1));

		const starsMaterial = new PointsMaterial({
			size: 50,
			vertexColors: true,
			transparent: true,
			opacity: 0.9,
			sizeAttenuation: true,
			blending: AdditiveBlending,
		});

		const stars = new Points(starsGeometry, starsMaterial);
		this.add(stars);
	}

	private createSun(radius: number) {
		// Create sun position (distant, on the "horizon")
		const sunX = radius * 0.7;
		const sunY = -radius * 0.3; // Below horizon for dramatic effect
		const sunZ = radius * 0.6;

		// Create visible sun mesh with glow
		const sunGeometry = new SphereGeometry(5000, 32, 32);
		const sunMaterial = new MeshBasicMaterial({
			color: new Color(1.0, 0.3, 0.2), // Red-orange glow
			transparent: true,
			opacity: 0.8,
		});

		this.sunMesh = new Mesh(sunGeometry, sunMaterial);
		this.sunMesh.position.set(sunX, sunY, sunZ);
		this.add(this.sunMesh);

		// Add point light for red glow effect
		this.sun = new PointLight(new Color(1.0, 0.2, 0.1), 0.3, 0);
		this.sun.position.set(sunX, sunY, sunZ);
		this.add(this.sun);
	}

	// Method to update the sun's pulsing animation
	// Call this from the game loop
	update(deltaTime: number) {
		this.animationTime += deltaTime;

		// Pulsing effect: oscillate between min and max intensity
		const intensity =
			ProceduralSkybox.SUN_MIN_INTENSITY +
			(ProceduralSkybox.SUN_MAX_INTENSITY - ProceduralSkybox.SUN_MIN_INTENSITY) *
				(Math.sin(this.animationTime * ProceduralSkybox.SUN_PULSE_SPEED) * 0.5 + 0.5);

		this.sun.intensity = intensity;

		// Also pulse the sun mesh opacity slightly
		const material = this.sunMesh.material as MeshBasicMaterial;
		material.opacity = 0.6 + intensity * 0.4;
	}
}
