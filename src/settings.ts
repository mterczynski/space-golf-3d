import _ from "lodash";

const _settings = {
	ball: ({
		bounciness: 0.8,
		launchForce: 10,
		radius: 8,
		showVelocityVector: false,
		traceDuration: 5,
		traceTransparency: 0.6,
	}),
	simulationMode: true,
	maxFlightDurationInSeconds: 30, // after 30 seconds without landing, the flight will end, and the ball will return to pre-flight position
	ticksPerSecond: 100, // flight calculations per second, not dependent on monitor's refresh rate
	camera: {
		fov: 30,
		near: 0.1,
		far: Math.pow(10, 6),
	},
	defaultPlanetDensity: 0.00024,
	maxPlanetOffset: 700,
	showFPSCounter: true,
	showInfoTab: false,
	skyboxOpacity: 1,
}

// todo - use deepFreeze util?
export const settings = Object.freeze({
	..._settings,
	ball: Object.freeze(_settings.ball),
	camera: Object.freeze(_settings.camera),
});

export type Settings = typeof _settings
