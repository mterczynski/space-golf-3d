import * as dat from 'dat.gui';
import { settings, saveSettings, resetSettings } from './settings';

export class SettingsManager {
	private gui: dat.GUI;
	private restartCallback: (() => void) | null = null;
	private skyboxOpacityCallback: ((opacity: number) => void) | null = null;

	// Settings that require app restart when changed
	private readonly restartRequiredSettings = new Set([
		'camera.fov',
		'camera.near',
		'camera.far',
		'simulationMode',
		'ticksPerSecond',
		'ball.radius',
	]);

	constructor() {
		this.gui = new dat.GUI({ width: 300 });
		this.setupGUI();
	}

	setRestartCallback(callback: () => void): void {
		this.restartCallback = callback;
	}

	setSkyboxOpacityCallback(callback: (opacity: number) => void): void {
		this.skyboxOpacityCallback = callback;
	}

	private setupGUI(): void {
		// Ball settings
		const ballFolder = this.gui.addFolder('Ball');
		this.addControl(ballFolder, settings.ball, 'bounciness', 0, 1, 0.01, 'ball.bounciness');
		this.addControl(ballFolder, settings.ball, 'launchForce', 0, 10, 0.1, 'ball.launchForce');
		this.addControl(ballFolder, settings.ball, 'radius', 1, 20, 1, 'ball.radius');
		this.addControl(ballFolder, settings.ball, 'showVelocityVector', null, null, null, 'ball.showVelocityVector');
		this.addControl(ballFolder, settings.ball, 'traceDuration', 0, 20, 1, 'ball.traceDuration');
		this.addControl(ballFolder, settings.ball, 'traceTransparency', 0, 1, 0.05, 'ball.traceTransparency');
		ballFolder.open();

		// Camera settings
		const cameraFolder = this.gui.addFolder('Camera');
		this.addControl(cameraFolder, settings.camera, 'fov', 10, 120, 1, 'camera.fov');
		this.addControl(cameraFolder, settings.camera, 'near', 0.01, 1, 0.01, 'camera.near');
		this.addControl(cameraFolder, settings.camera, 'far', 1000, 2000000, 1000, 'camera.far');
		cameraFolder.open();

		// General settings
		this.addControl(this.gui, settings, 'simulationMode', null, null, null, 'simulationMode');
		this.addControl(this.gui, settings, 'maxFlightDurationInSeconds', 1, 120, 1, 'maxFlightDurationInSeconds');
		this.addControl(this.gui, settings, 'ticksPerSecond', 10, 1000, 10, 'ticksPerSecond');
		this.addControl(this.gui, settings, 'defaultPlanetDensity', 0.00001, 0.001, 0.00001, 'defaultPlanetDensity');
		this.addControl(this.gui, settings, 'maxPlanetOffset', 100, 2000, 10, 'maxPlanetOffset');
		this.addControl(this.gui, settings, 'showFPSCounter', null, null, null, 'showFPSCounter');
		this.addControl(this.gui, settings, 'showInfoTab', null, null, null, 'showInfoTab');
		this.addControl(this.gui, settings, 'skyboxOpacity', 0, 1, 0.05, 'skyboxOpacity');

		// Add reset button
		this.gui.add({ reset: () => this.handleReset() }, 'reset').name('Reset to Defaults');
	}

	private addControl<T extends Record<string, any>>(
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
			controller = folder.add(object, property as string);
		} else if (min !== null && max !== null) {
			controller = folder.add(object, property as string, min, max);
			if (step !== null) {
				controller.step(step);
			}
		} else {
			controller = folder.add(object, property as string);
		}

		controller.onChange(() => {
			saveSettings();
			
			// Handle skybox opacity change immediately
			if (settingKey === 'skyboxOpacity' && this.skyboxOpacityCallback) {
				this.skyboxOpacityCallback(settings.skyboxOpacity);
			}
			
			// Auto-restart for settings that require it
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
		// Remove and recreate GUI to reflect changes
		this.gui.destroy();
		this.gui = new dat.GUI({ width: 300 });
		this.setupGUI();
		
		// Auto-restart after reset
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
