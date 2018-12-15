import { Scene, Object3D, Line } from "three";
import { Planet } from "./Planet";

export class ElementGetter {

	constructor(scene: Scene) {
		this.scene = scene;
	}

	private scene: Scene;

	deepSearch(element: Object3D, filteredObjects: Object3D[] = []) {
		if (element.name == name) {
			filteredObjects.push(element);
		}
		// Todo: test
		if (element.children) {
			element.children.forEach((subElement) => {
				return this.deepSearch(subElement, filteredObjects);
			});
		}
	}

	getPlanets(): Planet[] {
		return <Planet[]>this.scene.children.filter((el) => {
			return el instanceof Planet;
		});
	}

	getLines(): Line[] {
		return <Line[]>this.scene.children.filter((el) => {
			return el instanceof Line;
		});
	}

	getObjectsByName(name: string, recursive = true) {
		if (recursive) {
			return this.deepSearch(this.scene);
		}
		else {
			return this.scene.children.filter((el) => {
				return el.name == name;
			});
		}
	}
}
