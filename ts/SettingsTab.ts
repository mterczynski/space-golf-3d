import { GUI } from 'dat-gui';

export class SettingsTab {

	private settings = {
		gravity: 1,
		pathDuration: 25,
		timeSpeed: 1,
	};

	private initGui() {
		const gui = new GUI();

		gui.add(this.settings, 'timeSpeed', 0, 4);
		gui.add(this.settings, 'gravity', -1, 2);
		gui.add(this.settings, 'pathDuration', 0, 50);
	}

	constructor() {
		this.initGui();
	}

	getSettings() {
		return this.settings;
	}
}
