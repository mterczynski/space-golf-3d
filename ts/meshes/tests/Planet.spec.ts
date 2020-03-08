import { Planet } from '../Planet'
import { settings } from '../../settings';

describe('Planet', () => {
	describe('mass getter', () => {
		test('should return correct mass', () => {
			const radius = 30;
			const planet = new Planet({radius});

			const mass = planet.mass;

			expect(mass).toBe(Math.PI * 4 / 3 * settings.planetDensity * radius ** 3);
		})
	}),

	test('should take radius value from constructor', () => {
		const radius = 20;
		const planet = new Planet({radius});

		expect(planet.radius).toBe(radius);
	})
})
