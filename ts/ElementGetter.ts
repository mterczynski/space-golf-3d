import { Line, Scene } from 'three';
import { Planet } from './Planet';

export class ElementGetter {

	constructor(private scene: Scene) { }

	getPlanets(): Planet[] {
		return this.scene.children.filter(el => {
			return el instanceof Planet;
		}) as Planet[];
	}

	getLines(): Line[] {
		return this.scene.children.filter(el => {
			return el instanceof Line;
		}) as Line[];
	}
}
