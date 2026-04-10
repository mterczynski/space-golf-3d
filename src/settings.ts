import { deepFreeze } from './utils/deepFreeze';
import { SkyboxType } from './types/SkyboxType';

const useRandomLevel = true;

export interface Settings {
	ball: {
		bounciness: number;
		launchForce: number;
		radius: number;
		showVelocityVector: boolean;
		traceDuration: number;
		traceTransparency: number;
		outline: {
			enabled: boolean;
			edgeStrength: number;
			edgeGlow: number;
			color: string;
		};
	};
	camera: {
		fov: number;
		near: number;
		far: number;
		rotationSpeed: number;
	};
	planet: {
		defaultDensity: number;
		borderThickness: number;
		maxOffset: number;
	};
	skybox: {
		type: SkyboxType;
		opacity: number;
		useSphereSkybox: boolean;
	};
	simulationMode: boolean;
	useRandomLevel: boolean;
	usePreCalculatedFlight: boolean;
	maxFlightDurationInSeconds: number;
	ticksPerSecond: number;
	showFPSCounter: boolean;
	showInfoTab: boolean;
}

export const defaultSettings = deepFreeze<Settings>({
	ball: {
		bounciness: 0.8,
		launchForce: useRandomLevel ? 3.6 : 2.4,
		radius: 8,
		showVelocityVector: false,
		traceDuration: 5,
		traceTransparency: 0.6,
		outline: {
			enabled: true,
			edgeStrength: 3,
			edgeGlow: 0,
			color: '#00bfff',
		},
	},
	camera: {
		fov: 30,
		near: 0.1,
		far: Math.pow(10, 6),
		rotationSpeed: 0, // Set to 0 to disable rotation, or use values like 1 for normal speed
	},
	planet: {
		defaultDensity: 0.00014,
		borderThickness: 2,
		maxOffset: 700,
	},
	skybox: {
		type: SkyboxType.PROCEDURAL,
		opacity: 1,
		useSphereSkybox: false,
	},
	simulationMode: true,
	useRandomLevel,
	usePreCalculatedFlight: false, // Use deterministic pre-calculated flight trajectories
	maxFlightDurationInSeconds: 30, // after 30 seconds without landing, the flight will end, and the ball will return to pre-flight position
	ticksPerSecond: 128, // game calculations per second, FPS independent
	showFPSCounter: true,
	showInfoTab: false,
});

