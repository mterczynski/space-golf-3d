import { Line, Object3D, Scene } from 'three';
import { Planet } from './meshes/Planet';

export class ElementGetter {
	constructor(private scene: Scene) { }

	getPlanets(): Planet[] {
		return this.getInstancesOf(Planet)
	}

	getLines(): Line[] {
		return this.getInstancesOf(Line)
	}

	private getInstancesOf<T extends Object3D>(klass: { new(...args: any[]): T }): T[] {
		return this.scene.children.filter(el => el instanceof klass) as T[];
	}
}
