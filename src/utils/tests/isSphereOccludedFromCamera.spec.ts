import { Vector3 } from "three";
import { isSphereOccludedFromCamera } from "../isSphereOccludedFromCamera";

describe("isSphereOccludedFromCamera", () => {
	const cameraPosition = new Vector3(0, 0, 0);
	const targetSphere = {
		position: new Vector3(0, 0, 10),
		radius: 1,
	};

	test("returns true when target sphere is directly behind an occluding sphere", () => {
		const result = isSphereOccludedFromCamera({
			cameraPosition,
			targetSphere,
			occludingSpheres: [
				{
					position: new Vector3(0, 0, 5),
					radius: 2,
				},
			],
		});

		expect(result).toBe(true);
	});

	test("returns true when target sphere is only partially covered by an occluding sphere", () => {
		const result = isSphereOccludedFromCamera({
			cameraPosition,
			targetSphere,
			occludingSpheres: [
				{
					position: new Vector3(1.4, 0, 5),
					radius: 1,
				},
			],
		});

		expect(result).toBe(true);
	});

	test("returns false when occluding sphere is outside target projection", () => {
		const result = isSphereOccludedFromCamera({
			cameraPosition,
			targetSphere,
			occludingSpheres: [
				{
					position: new Vector3(4, 0, 5),
					radius: 1,
				},
			],
		});

		expect(result).toBe(false);
	});

	test("returns false when occluding sphere is behind target sphere", () => {
		const result = isSphereOccludedFromCamera({
			cameraPosition,
			targetSphere,
			occludingSpheres: [
				{
					position: new Vector3(0, 0, 15),
					radius: 1,
				},
			],
		});

		expect(result).toBe(false);
	});
});
