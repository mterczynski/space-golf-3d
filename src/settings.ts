export const settings = Object.freeze({
	ball: Object.freeze({
		bounciness: 0.8,
		launchForce: 5.4,
		radius: 8,
		showVelocityVector: false,
		traceDuration: 5,
		traceTransparency: 0.6,
	}),
	autoLaunch: false,
	camera: {
		fov: 30,
		near: 0.1,
		far: Math.pow(10, 6),
	},
	defaultPlanetDensity: 0.00014,
	maxPlanetOffset: 700,
	showFPSCounter: true,
	showInfoTab: false,
	skyboxOpacity: 1,
});
