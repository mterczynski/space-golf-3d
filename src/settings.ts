const useRandomLevel = true;

export const settings = Object.freeze({
	ball: Object.freeze({
		bounciness: 0.8,
		launchForce: useRandomLevel ? 3.6 : 2.4,
		radius: 8,
		showVelocityVector: false,
		traceDuration: 5,
		traceTransparency: 0.6,
		/**
		 * Maximum angle deviation from the outward normal when launching in simulation mode (in radians).
		 * 0 = vertical launch (exactly along outward normal from planet center to ball)
		 * Math.PI/2 (90°) = allows launches up to 90 degrees from vertical (full hemisphere)
		 * Math.PI (180°) = clamped to Math.PI/2 internally, same as 90 degrees
		 * Note: Values greater than Math.PI/2 are automatically clamped to prevent pointing toward planet.
		 */
		launchAlphaAngle: Math.PI,
	}),
	camera: {
		fov: 30,
		near: 0.1,
		far: Math.pow(10, 6),
		/**
		 * Set to 0 to disable rotation, or use values like 1 for normal speed.
		 */
		rotationSpeed: 0,
	},
	planet: {
		defaultDensity: 0.00014,
		borderThickness: 2,
		maxOffset: 700,
	},
	skybox: {
		useSphereSkybox: true,
		opacity: 1,
	},
	simulationMode: true,
	useRandomLevel,
	/**
	 * Use deterministic pre-calculated flight trajectories. Doesn't work correctly as of yet.
	 */
	usePreCalculatedFlight: false,
	/**
	 * After 30 seconds without landing, the flight will end, and the ball will return to pre-flight position.
	 */
	maxFlightDurationInSeconds: 30,
	/**
	 * Game calculations per second, FPS independent.
	 */
	ticksPerSecond: 128,
	showFPSCounter: true,
	showInfoTab: false,
});
