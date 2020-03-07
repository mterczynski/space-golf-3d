import { GUI } from 'dat-gui';

export class SettingsTab {

	private settings = {
		changeCamera: () => {
			console.warn('changeCamera method not set');
		},
		gravity: 1,
		pathDuration: 25,
		timeSpeed: 1,
	};

	private gui = new GUI();

	private init() {
		this.gui.add(this.settings, 'timeSpeed', 0, 4);
		this.gui.add(this.settings, 'gravity', -1, 2);
		this.gui.add(this.settings, 'pathDuration', 0, 50);
		this.gui.add(this.settings, 'changeCamera');
	}

	constructor() {
		this.init();
	}

	getSettings() {
		return this.settings;
	}

	setChangeCameraFunction(func: () => void) {
		this.settings.changeCamera = func;
		this.gui.add(this.settings, 'changeCamera');
	}
}
