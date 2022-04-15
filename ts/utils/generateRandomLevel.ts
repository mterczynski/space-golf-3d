import _ = require("lodash");
import randomColor = require("randomcolor");
import { Vector3 } from "three";
import { settings } from "../settings";


interface Sphere {
	position: Vector3;
	radius: number;
}

interface Planet extends Sphere {
	color: string;
}

interface Level {
	planets: Planet[];
	initialBallPosition: Vector3;
	// TODO
	// flagPosition:Vector3;
}


function isMinimumDistanceBetweenSpheres(sphere1: Sphere, sphere2: Sphere, minimumDistance: number): boolean {
	return sphere1.position.distanceTo(sphere2.position) < sphere1.radius + sphere2.radius + minimumDistance;
}

function getRandomInitialBallPosition(planets: Sphere[], ballRadius: number) {
	const startingPlanet = _.sample(planets)!;
	const randomRadius = new Vector3(
		_.random(-0.5, 0.5),
		_.random(-0.5, 0.5),
		_.random(-0.5, 0.5)
	).normalize().multiplyScalar(startingPlanet.radius).addScalar(ballRadius + 0.1);

	return startingPlanet.position.clone().add(randomRadius)
}

export function generateRandomLevel(): Level {
	const maxPlanetOffset = 700;
	const minimumDistanceBetweenPlanets = 20;
	const planetCount = 10;

	let planets: Planet[] = [];

	while(planets.length < planetCount) {
		const radius = _.random(20, 100);
		const position = new Vector3(
			_.random(-maxPlanetOffset, maxPlanetOffset),
			_.random(-maxPlanetOffset, maxPlanetOffset),
			_.random(-maxPlanetOffset, maxPlanetOffset)
		);

		const planet = {
			radius,
			position,
			color: randomColor()
		}

		if(!planets.some(_planet => isMinimumDistanceBetweenSpheres(planet, _planet, minimumDistanceBetweenPlanets))) {
			planets.push(planet)
		}
	}

	const level = {
		planets,
		initialBallPosition: getRandomInitialBallPosition(planets, settings.ball.radius),
	}

	return level
}
