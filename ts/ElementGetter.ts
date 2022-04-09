import { Line, Scene } from 'three';
import { MeshName } from './interfaces/MeshName';
import { Planet } from './meshes/Planet';

export class ElementGetter {
	constructor(private scene: Scene) { }

	// getPlanets(): Planet[] {
	// 	return this.scene.children.filter(el => el.name === MeshName.Planet) as Planet[];
	// }

	getLines(): Line[] {
		return this.scene.children.filter(el => el instanceof Line) as Line[];
	}
}
