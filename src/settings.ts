export const settings = Object.freeze({
	ball: Object.freeze({
		bounciness: 0.8,
		launchForce: 2.4,
		radius: 8,
		showVelocityVector: false,
		traceDuration: 5,
		traceTransparency: 0.6,
	}),
	simulationMode: true,
	useRandomLevel: false,
	usePreCalculatedFlight: false, // Use deterministic pre-calculated flight trajectories
	maxFlightDurationInSeconds: 30, // after 30 seconds without landing, the flight will end, and the ball will return to pre-flight position
	ticksPerSecond: 128, // game calculations per second, FPS independent
	camera: {
		fov: 30,
		near: 0.1,
		far: Math.pow(10, 6),
		rotationSpeed: 0, // Set to 0 to disable rotation, or use values like 1 for normal speed
	},
	defaultPlanetDensity: 0.00014,
	maxPlanetOffset: 700,
	showFPSCounter: true,
	showInfoTab: false,
	skyboxOpacity: 1,
});
