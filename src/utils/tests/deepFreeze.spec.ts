import { deepFreeze } from '../deepFreeze';

describe('deepFreeze', () => {
	test('deeply freezes nested objects and arrays', () => {
		const value = {
			planet: {
				radius: 10,
				colors: ['blue', 'green'],
			},
		};

		const frozen = deepFreeze(value);

		expect(frozen).toBe(value);
		expect(Object.isFrozen(frozen)).toBe(true);
		expect(Object.isFrozen(frozen.planet)).toBe(true);
		expect(Object.isFrozen(frozen.planet.colors)).toBe(true);
	});

	test('prevents mutation of nested values', () => {
		const frozen = deepFreeze({ nested: { label: 'before' } });

		expect(() => {
			// @ts-expect-error intentional mutation attempt for runtime freeze verification
			frozen.nested.label = 'after';
		}).toThrow(TypeError);
		expect(frozen.nested.label).toBe('before');
	});
});
