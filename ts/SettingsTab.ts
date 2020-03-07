import { GUI } from 'dat-gui';

export class SettingsTab {

	private settings = {
		gravity: 1,
		pathDuration: 25,
		timeSpeed: 1,
	};

	private gui = new GUI();

	private init() {
		this.gui.add(this.settings, 'timeSpeed', 0, 4);
		this.gui.add(this.settings, 'gravity', -1, 2);
		this.gui.add(this.settings, 'pathDuration', 0, 50);
	}

	constructor() {
		this.init();
	}

	getSettings() {
		return this.settings;
	}
}
