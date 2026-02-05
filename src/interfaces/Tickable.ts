import { Planet } from "../meshes/Planet";

export interface Tickable {
	tick: (planets?: Planet[]) => void;
}
