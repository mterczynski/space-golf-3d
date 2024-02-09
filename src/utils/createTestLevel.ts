import { Vector3 } from "three";
import _ from "lodash";

/**
 * @returns a level used for e2e tests, especially for determinism tests
 */
export function createTestLevel() {
	const level = {
		planets: [
			{
				"color": "#87e5b0",
				"radius": 21,
				"position": new Vector3(278, -304, -313)
			},
			{
				"color": "#c964ea",
				"radius": 94,
				"position": new Vector3(-22, -183, -595)
			},
			{
				"color": "#2ef279",
				"radius": 31,
				"position": new Vector3(656, 495, -617)
			},
			{
				"color": "#5ecc4d",
				"radius": 94,
				"position": new Vector3(296, 438, -38)
			},
			{
				"color": "#d66e51",
				"radius": 96,
				"position": new Vector3(612, 578, 491)
			},
			{
				"color": "#45ef86",
				"radius": 63,
				"position": new Vector3(-338, -190, 656)
			},
			{
				"color": "#9a2aea",
				"radius": 94,
				"position": new Vector3(-295, -243, -382)
			},
			{
				"color": "#9683f7",
				"radius": 64,
				"position": new Vector3(674, -392, 466)
			},
			{
				"color": "#f23ebc",
				"radius": 50,
				"position": new Vector3(413, -445, 272)
			},
			{
				"color": "#5d9aea",
				"radius": 55,
				"position": new Vector3(684, -395, -566)
			}
		],
		initialBallPosition: new Vector3(393.04081542468845, -477.8397276414723, 274.04848270177894)
	}

	return level
}
