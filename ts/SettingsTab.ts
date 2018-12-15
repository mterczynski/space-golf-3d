import { GUI } from "dat-gui";

export class SettingsTab {

	constructor() {
		this.init();
	}

	private settings = {
		timeSpeed: 1,
		gravity: 1,
		pathDuration: 25,
		anaglyphEffect: false,
		changeCamera: () => {
			console.warn('changeCamera method not set');
		}
	}
	private gui = new GUI();

	private init() {
		this.gui.add(this.settings, 'timeSpeed', 0, 4);
		this.gui.add(this.settings, 'gravity', -1, 2);
		this.gui.add(this.settings, 'pathDuration', 0, 50);
		this.gui.add(this.settings, 'anaglyphEffect');
		this.gui.add(this.settings, 'changeCamera');
	}

	getSettings() {
		return this.settings;
	}

	setChangeCameraFunction(func: () => void) {
		this.settings.changeCamera = func;
		this.gui.add(this.settings, 'changeCamera');
	}
}
