import type { DeepReadonly } from '../types/DeepReadonly';

export type { DeepReadonly } from '../types/DeepReadonly';

export function deepFreeze<T>(obj: T): DeepReadonly<T> {
	if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
		Object.values(obj as Record<string, unknown>).forEach((value) => {
			if (value && typeof value === 'object') {
				deepFreeze(value);
			}
		});
		Object.freeze(obj);
	}

	return obj as DeepReadonly<T>;
}
