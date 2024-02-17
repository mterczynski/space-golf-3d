export const settings = Object.freeze({
	ball: Object.freeze({
		bounciness: 0.8,
		launchForce: 12.4,
		radius: 8, // todo - change to 8
		showVelocityVector: false,
		traceDuration: 5,
		traceTransparency: 0.6,
	}),
	simulationMode: true,
	maxFlightDurationInSeconds: 12, // after 30 seconds without landing, the flight will end, and the ball will return to pre-flight position
	ticksPerSecond: 144, // flight calculations per second, FPS independent
	camera: {
		fov: 30,
		near: 0.1,
		far: Math.pow(10, 6),
	},
	defaultPlanetDensity: 0.00054,
	maxPlanetOffset: 700,
	showFPSCounter: true,
	showInfoTab: false,
	skyboxOpacity: 1,
});
