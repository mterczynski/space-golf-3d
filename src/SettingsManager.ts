import * as dat from 'dat.gui';
import cloneDeep from 'lodash/cloneDeep';
import { defaultSettings, type Settings } from './settings';
import { LocalStorageService } from './services/LocalStorageService';
import { SkyboxType } from './types/SkyboxType';

function getDefaultSettings(): Settings {
	return cloneDeep(defaultSettings);
}

/**
 * Returns a normalized clone of the provided settings.
 *
 * Keeps dependent skybox fields in sync so persisted/runtime settings stay consistent,
 * without mutating the input object passed by the caller.
 */
function normalizeSettings(currentSettings: Readonly<Settings>): Settings {
	const normalizedSettings = cloneDeep(currentSettings);

	if (normalizedSettings.skybox.useSphereSkybox && normalizedSettings.skybox.type !== SkyboxType.SPHERE) {
		normalizedSettings.skybox.type = SkyboxType.SPHERE;
	} else if (!normalizedSettings.skybox.useSphereSkybox && normalizedSettings.skybox.type === SkyboxType.SPHERE) {
		normalizedSettings.skybox.type = defaultSettings.skybox.type;
	}

	normalizedSettings.skybox.useSphereSkybox = normalizedSettings.skybox.type === SkyboxType.SPHERE;
	return normalizedSettings;
}

function mergeSettingsWithDefaults(savedSettings: Partial<Settings>): Settings {
	const defaults = getDefaultSettings();

	return {
		...defaults,
		...savedSettings,
		ball: {
			...defaults.ball,
			...(savedSettings.ball || {}),
			outline: {
				...defaults.ball.outline,
				...(savedSettings.ball?.outline || {}),
			},
		},
		camera: { ...defaults.camera, ...(savedSettings.camera || {}) },
		planet: { ...defaults.planet, ...(savedSettings.planet || {}) },
		skybox: { ...defaults.skybox, ...(savedSettings.skybox || {}) },
	};
}

function loadSettings(): Settings {
	const savedSettings = LocalStorageService.get<Partial<Settings>>('settings');
	return savedSettings ? normalizeSettings(mergeSettingsWithDefaults(savedSettings)) : getDefaultSettings();
}

let currentSettings: Settings = loadSettings();

export function getSettings(): Readonly<Settings> {
	return currentSettings;
}

export function saveSettings(settingsToSave: Readonly<Settings> = currentSettings): void {
	currentSettings = normalizeSettings(settingsToSave);
	LocalStorageService.set('settings', currentSettings);
}

export function resetSettings(): void {
	currentSettings = getDefaultSettings();
	saveSettings(currentSettings);
}

export class SettingsManager {
	private gui: dat.GUI;
	private guiSettings: Settings = currentSettings;
	private restartCallback: (() => void) | null = null;
	private settingChangeCallback: ((settingKey: string) => void) | null = null;

	// Settings that require a level/app rebuild when changed
	private readonly restartRequiredSettings = new Set([
		'simulationMode',
		'ball.radius',
		'useRandomLevel',
		'planet.defaultDensity',
		'planet.maxOffset',
	]);

	constructor() {
		this.gui = new dat.GUI({ width: 300 });
		this.setupGUI();
	}

	setRestartCallback(callback: () => void): void {
		this.restartCallback = callback;
	}

	setSettingChangeCallback(callback: (settingKey: string) => void): void {
		this.settingChangeCallback = callback;
	}

	private setupGUI(): void {
		this.guiSettings = currentSettings;
		const settings = this.guiSettings;
		const ballFolder = this.gui.addFolder('Ball');
		this.addControl(ballFolder, settings.ball, 'bounciness', 0, 1, 0.01, 'ball.bounciness');
		this.addControl(ballFolder, settings.ball, 'launchForce', 0, 10, 0.1, 'ball.launchForce');
		this.addControl(ballFolder, settings.ball, 'radius', 1, 20, 1, 'ball.radius');
		this.addControl(ballFolder, settings.ball, 'showVelocityVector', null, null, null, 'ball.showVelocityVector');
		this.addControl(ballFolder, settings.ball, 'traceDuration', 0, 20, 1, 'ball.traceDuration');
		this.addControl(ballFolder, settings.ball, 'traceTransparency', 0, 1, 0.05, 'ball.traceTransparency');
		ballFolder.open();

		const cameraFolder = this.gui.addFolder('Camera');
		this.addControl(cameraFolder, settings.camera, 'fov', 10, 120, 1, 'camera.fov');
		this.addControl(cameraFolder, settings.camera, 'near', 0.01, 1, 0.01, 'camera.near');
		this.addControl(cameraFolder, settings.camera, 'far', 1000, 2000000, 1000, 'camera.far');
		this.addControl(cameraFolder, settings.camera, 'rotationSpeed', 0, 2, 0.1, 'camera.rotationSpeed');
		cameraFolder.open();

		const planetFolder = this.gui.addFolder('Planet');
		this.addControl(planetFolder, settings.planet, 'defaultDensity', 0.00001, 0.001, 0.00001, 'planet.defaultDensity');
		this.addControl(planetFolder, settings.planet, 'borderThickness', 0, 10, 0.5, 'planet.borderThickness');
		this.addControl(planetFolder, settings.planet, 'maxOffset', 100, 2000, 10, 'planet.maxOffset');
		planetFolder.open();

		const skyboxFolder = this.gui.addFolder('Skybox');
		this.addControl(skyboxFolder, settings.skybox, 'useSphereSkybox', null, null, null, 'skybox.useSphereSkybox');
		this.addControl(skyboxFolder, settings.skybox, 'opacity', 0, 1, 0.05, 'skybox.opacity');
		skyboxFolder.open();

		const generalFolder = this.gui.addFolder('General');
		this.addControl(generalFolder, settings, 'simulationMode', null, null, null, 'simulationMode');
		this.addControl(generalFolder, settings, 'useRandomLevel', null, null, null, 'useRandomLevel');
		this.addControl(generalFolder, settings, 'showFPSCounter', null, null, null, 'showFPSCounter');
		this.addControl(generalFolder, settings, 'showInfoTab', null, null, null, 'showInfoTab');
		generalFolder.open();

		const flightFolder = this.gui.addFolder('Flight');
		this.addControl(flightFolder, settings, 'usePreCalculatedFlight', null, null, null, 'usePreCalculatedFlight');
		this.addControl(flightFolder, settings, 'maxFlightDurationInSeconds', 1, 120, 1, 'maxFlightDurationInSeconds');
		this.addControl(flightFolder, settings, 'ticksPerSecond', 10, 1000, 10, 'ticksPerSecond');
		flightFolder.open();

		this.gui.add({ reset: () => this.handleReset() }, 'reset').name('Reset to Defaults');
	}

	private addControl<T extends object>(
		folder: dat.GUI,
		object: T,
		property: keyof T,
		min: number | null,
		max: number | null,
		step: number | null,
		settingKey: string
	): void {
		let controller: dat.GUIController;

		if (typeof object[property] === 'boolean') {
			controller = folder.add(object, property);
		} else if (min !== null && max !== null) {
			controller = folder.add(object, property, min, max);
			if (step !== null) {
				controller.step(step);
			}
		} else {
			controller = folder.add(object, property);
		}

		controller.onChange(() => {
			saveSettings(this.guiSettings);
			this.settingChangeCallback?.(settingKey);

			if (this.restartRequiredSettings.has(settingKey)) {
				this.autoRestart();
			}
		});
	}

	private autoRestart(): void {
		if (this.restartCallback) {
			this.restartCallback();
		}
	}

	private handleReset(): void {
		resetSettings();
		this.gui.destroy();
		this.gui = new dat.GUI({ width: 300 });
		this.setupGUI();
		this.autoRestart();
	}

	show(): void {
		this.gui.show();
	}

	hide(): void {
		this.gui.hide();
	}

	destroy(): void {
		this.gui.destroy();
	}
}
