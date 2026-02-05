const useRandomLevel = true;

export const settings = Object.freeze({
	ball: Object.freeze({
		bounciness: 0.8,
		launchForce: useRandomLevel ? 3.6 : 2.4,
		radius: 8,
		showVelocityVector: false,
		traceDuration: 5,
		traceTransparency: 0.6,
	}),
	camera: {
		fov: 30,
		near: 0.1,
		far: Math.pow(10, 6),
		rotationSpeed: 0, // Set to 0 to disable rotation, or use values like 1 for normal speed
	},
	planet: {
		defaultDensity: 0.00014,
		borderThickness: 3,
		maxOffset: 700,
	},
	skybox: {
		useSphereSkybox: true,
		opacity: 1,
	},
	simulationMode: true,
	useRandomLevel,
	usePreCalculatedFlight: false, // Use deterministic pre-calculated flight trajectories
	maxFlightDurationInSeconds: 30, // after 30 seconds without landing, the flight will end, and the ball will return to pre-flight position
	ticksPerSecond: 128, // game calculations per second, FPS independent
	showFPSCounter: true,
	showInfoTab: false,
});
