import { Vector3 } from "three";
import { Ball } from "../meshes/Ball";
import { Planet } from "../meshes/Planet";
import { settings as _settings } from "../settings";
import { calcGravityForce } from "./calcGravityForce";
import { calcVelocityAfterRebound } from "./calcVelocityAfterRebound";
import { playSound } from "./playSound";
import { adjustBallPositionAfterCollision } from "./adjustBallPositionAfterCollision";
import { isBallCollidingWithPlanet } from "./sphereCollisions";

interface CollisionResult {
	/** will be (0,0,0) if stopsBall is true */
	newVelocity: Vector3;
	contactPoint: Vector3;
	stopsBall: boolean;
}

export type Flight = {
	ticks: {
		position: Vector3;
		velocity: Vector3;
	}[];
	/** indexes of ticks with collisions */
	ticksWithCollisions: number[];
};

type FlightSettings = {
	ticksPerSecond: number;
	maxFlightDurationInSeconds: number;
};

/**
 * Deterministic flight calculation.
 * Given the same inputs, this returns the same trajectory (independent of frame rate).
 * NOTE: Currently unused; planned to be enabled behind a setting/feature flag.
 */
export function calculateFlight(
	launchVector: Vector3,
	ball: Ball,
	planets: Planet[],
	settings: FlightSettings = {
		ticksPerSecond: _settings.ticksPerSecond,
		maxFlightDurationInSeconds: _settings.maxFlightDurationInSeconds ?? 30,
	}
): Flight {
	const ticksPerSecond = settings.ticksPerSecond;
	const maxFlightDurationInSeconds = settings.maxFlightDurationInSeconds;
	const startingPosition = ball.position.clone();

	const ticks = [
		{
			position: startingPosition.clone(),
			velocity: launchVector.clone(),
		},
	];
	const ticksWithCollisions = [];

	let wasLastTickCollision = false;

	for (let tick = 1; tick < ticksPerSecond * maxFlightDurationInSeconds; tick++) {
		const lastTick = ticks[tick - 1];

		const collisionResult = bounceBallOffPlanets(
			{
				position: lastTick.position.clone(),
				radius: ball.radius,
				velocity: lastTick.velocity.clone(),
			},
			planets
		);

		if (collisionResult && !wasLastTickCollision) {
			ticksWithCollisions.push(tick);
			wasLastTickCollision = true;
			console.log("## collisionResult, tick", +tick);
			ticks.push({
				velocity: collisionResult.newVelocity,
				position: collisionResult.contactPoint.clone(),
			});
		} else {
			wasLastTickCollision = false;
			// Calculate new velocity by adding gravity acceleration
			const newVelocity = lastTick.velocity.clone().add(calcVelocityChangeAfterGravityTick(ticksPerSecond, ball, planets));
			
			// Update position: velocity is calibrated for ~60 FPS, so scale by tick duration
			// At 60 FPS, timeDelta ~ 1/60 = 0.0167s
			// At current ticksPerSecond, timeDelta = 1/ticksPerSecond
			// Scale factor = (1/ticksPerSecond) / (1/60) = 60/ticksPerSecond
			const referenceFPS = 60;
			const positionScaleFactor = referenceFPS / ticksPerSecond;
			const newPosition = lastTick.position.clone().add(lastTick.velocity.clone().multiplyScalar(positionScaleFactor));
			
			ticks.push({
				velocity: newVelocity,
				position: newPosition,
			});
		}
	}

	return { ticks, ticksWithCollisions };
}

function calcVelocityChangeAfterGravityTick(ticksPerSecond: number, ball: Ball, planets: Planet[]) {
	// Deterministic tick duration derived from ticksPerSecond (not real-time delta).
	// Convert to seconds: 1000ms / ticksPerSecond / 1000 = 1 / ticksPerSecond seconds
	const tickDuration = 1 / ticksPerSecond;
	const velocityChange = new Vector3(0, 0, 0);

	planets.forEach((planet: Planet) => {
		velocityChange.add(calcGravityForce({ puller: planet, pulled: ball, timeDelta: tickDuration }));
	});

	return velocityChange;
}

function bounceBallOffPlanets(
	ball: Pick<Ball, "velocity" | "radius" | "position">,
	planets: Planet[]
): CollisionResult | null {
	let collisionResult: CollisionResult | null = null;

	planets.some((planet) => {
		if (isBallCollidingWithPlanet(ball, planet)) {
			const newVelocity = calcVelocityAfterRebound({
				staticSphere: planet,
				movingSphere: ball,
			});

			// if (settings.simulationMode) {
			// 	console.log('## simulation', 'hit', ball.position.toArray().map(i => Math.floor(i)).toString())
			// }

			const hitSoundVolume = Math.min(1, ball.velocity.length() / 5);
			playSound.ballHit(hitSoundVolume);

			const contactPoint = adjustBallPositionAfterCollision(ball, planet);
			if (newVelocity.length() < 0.2) {
				collisionResult = {
					newVelocity: new Vector3(0, 0, 0),
					contactPoint,
					stopsBall: true,
				};
			} else {
				collisionResult = {
					newVelocity,
					contactPoint,
					stopsBall: false,
				};
			}

			return true;
		}

		return false;
	});

	return collisionResult;
}
