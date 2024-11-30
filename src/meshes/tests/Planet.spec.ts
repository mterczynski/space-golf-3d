import { Planet } from '../Planet';

describe('Planet', () => {
	describe('mass getter', () => {
		test('should return correct mass', () => {
			const planetRadius = 30;
			const planetDensity = 4;
			const planet = new Planet({
				radius: planetRadius,
				density: planetDensity
			});

			const mass = planet.mass;

			expect(mass).toBe(Math.PI * 4 / 3 * planetDensity * planetRadius ** 3);
		});
	})

	test('should take radius value from constructor', () => {
		const radius = 20;
		const planet = new Planet({ radius });

		expect(planet.radius).toBe(radius);
	});
});
