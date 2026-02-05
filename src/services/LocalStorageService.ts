const LOCAL_STORAGE_PREFIX = 'space-golf-3d:';

export class LocalStorageService {
	static get<T>(key: string): T | null {
		try {
			const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
			return item ? JSON.parse(item) : null;
		} catch (error) {
			console.error('Error reading from localStorage:', error);
			return null;
		}
	}

	static set<T>(key: string, value: T): void {
		try {
			localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
		} catch (error) {
			console.error('Error writing to localStorage:', error);
		}
	}

	static remove(key: string): void {
		try {
			localStorage.removeItem(LOCAL_STORAGE_PREFIX + key);
		} catch (error) {
			console.error('Error removing from localStorage:', error);
		}
	}

	static clear(): void {
		try {
			const keys = Object.keys(localStorage);
			keys.forEach((key) => {
				if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
					localStorage.removeItem(key);
				}
			});
		} catch (error) {
			console.error('Error clearing localStorage:', error);
		}
	}
}
