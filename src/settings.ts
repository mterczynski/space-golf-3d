import { LocalStorageService } from './services/LocalStorageService';

export interface Settings {
	ball: {
		bounciness: number;
		launchForce: number;
		radius: number;
		showVelocityVector: boolean;
		traceDuration: number;
		traceTransparency: number;
	};
	simulationMode: boolean;
	maxFlightDurationInSeconds: number;
	ticksPerSecond: number;
	camera: {
		fov: number;
		near: number;
		far: number;
	};
	defaultPlanetDensity: number;
	maxPlanetOffset: number;
	showFPSCounter: boolean;
	showInfoTab: boolean;
	skyboxOpacity: number;
}

const defaultSettings: Settings = {
	ball: {
		bounciness: 0.8,
		launchForce: 3.5,
		radius: 8,
		showVelocityVector: false,
		traceDuration: 5,
		traceTransparency: 0.6,
	},
	simulationMode: true,
	maxFlightDurationInSeconds: 30,
	ticksPerSecond: 500,
	camera: {
		fov: 30,
		near: 0.1,
		far: Math.pow(10, 6),
	},
	defaultPlanetDensity: 0.00014,
	maxPlanetOffset: 700,
	showFPSCounter: true,
	showInfoTab: false,
	skyboxOpacity: 1,
};

// Deep clone helper
function deepClone<T>(obj: T): T {
	return structuredClone(obj);
}

// Load settings from localStorage or use defaults
function loadSettings(): Settings {
	const savedSettings = LocalStorageService.get<Settings>('settings');
	if (savedSettings) {
		// Merge saved settings with defaults to ensure new settings are present
		return {
			...deepClone(defaultSettings),
			...savedSettings,
			ball: { ...defaultSettings.ball, ...(savedSettings.ball || {}) },
			camera: { ...defaultSettings.camera, ...(savedSettings.camera || {}) },
		};
	}
	return deepClone(defaultSettings);
}

export const settings: Settings = loadSettings();

export function saveSettings(): void {
	LocalStorageService.set('settings', settings);
}

export function resetSettings(): void {
	Object.assign(settings, deepClone(defaultSettings));
	saveSettings();
}

export function getDefaultSettings(): Settings {
	return deepClone(defaultSettings);
}
