import { LocalStorageService } from './services/LocalStorageService';

const useRandomLevel = true;

export interface Settings {
ball: {
bounciness: number;
launchForce: number;
radius: number;
showVelocityVector: boolean;
traceDuration: number;
traceTransparency: number;
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
useSphereSkybox: boolean;
opacity: number;
};
simulationMode: boolean;
useRandomLevel: boolean;
usePreCalculatedFlight: boolean;
maxFlightDurationInSeconds: number;
ticksPerSecond: number;
showFPSCounter: boolean;
showInfoTab: boolean;
}

const defaultSettings: Settings = {
ball: {
bounciness: 0.8,
launchForce: useRandomLevel ? 3.6 : 2.4,
radius: 8,
showVelocityVector: false,
traceDuration: 5,
traceTransparency: 0.6,
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
useSphereSkybox: true,
opacity: 1,
},
simulationMode: true,
useRandomLevel,
usePreCalculatedFlight: false, // Use deterministic pre-calculated flight trajectories
maxFlightDurationInSeconds: 30, // after 30 seconds without landing, the flight will end, and the ball will return to pre-flight position
ticksPerSecond: 128, // game calculations per second, FPS independent
showFPSCounter: true,
showInfoTab: false,
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
planet: { ...defaultSettings.planet, ...(savedSettings.planet || {}) },
skybox: { ...defaultSettings.skybox, ...(savedSettings.skybox || {}) },
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
