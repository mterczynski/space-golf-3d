import { Scene, Object3D, Line } from 'three';
import { ElementGetter } from '../ElementGetter';
import { Planet } from '../meshes/Planet';

describe('ElementGetter', () => {
	describe('getPlanets', () => {
		test('should return all planets in the scene', () => {
			const scene = new Scene();
			const elementGetter = new ElementGetter(scene);
			const planet1 = new Planet({radius: 1});
			const planet2 = new Planet({radius: 2});
			const unrelatedObject = new Object3D();

			scene.add(planet1.mesh, unrelatedObject, planet2.mesh);

			expect(elementGetter.getPlanets()).toEqual([planet1, planet2]);
		})
	}),

	describe('getLines', () => {
		test('should return all lines in the scene', () => {
			const scene = new Scene();
			const elementGetter = new ElementGetter(scene);
			const line1 = new Line();
			const line2 = new Line();
			const unrelatedObject = new Object3D();

			scene.add(line1, unrelatedObject, line2);

			expect(elementGetter.getLines()).toEqual([line1, line2]);
		})
	})
})
