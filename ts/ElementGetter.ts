import { Scene, Line } from "three";
import { Planet } from "./Planet";

export class ElementGetter {

	constructor(private scene: Scene) { }

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
}
