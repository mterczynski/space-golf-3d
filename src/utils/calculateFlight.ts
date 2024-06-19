import { Vector3 } from "three";
import { Ball, Flight } from "../meshes/Ball";
import { Planet } from "../meshes/Planet";
import { settings } from "../settings";
import { calcGravityForce } from "./calcGravityForce";
import { calcVelocityAfterRebound } from "./calcVelocityAfterRebound";
import { playSound } from "./playSound";
import { adjustBallPositionAfterCollision } from "./adjustBallPositionAfterCollision";
import { isBallCollidingWithPlanet } from "./sphereCollisions";
import { last } from "lodash";

interface CollisionResult {
	/** will be (0,0,0) if stopsBall is true */
	newVelocity: Vector3,
	contactPoint: Vector3,
	stopsBall: boolean
}

export function calculateFlight(launchVector: Vector3, ball: Ball, planets: Planet[]): Flight {
	const ticksPerSecond = settings.ticksPerSecond
	const maxFlightDurationInSeconds = settings.maxFlightDurationInSeconds
	const startingPosition = ball.position.clone()

	const ticks = [
		{
			position: startingPosition.clone(),
			velocity: launchVector.clone(),
		}
	]
	const ticksWithCollisions = []

	let wasLastTickCollision = false

	for (let tick = 1; tick < ticksPerSecond * maxFlightDurationInSeconds; tick++) {
		const lastTick = ticks[tick - 1]

		const collisionResult = bounceBallOffPlanets({
			position: lastTick.position.clone(),
			radius: ball.radius,
			velocity: lastTick.velocity.clone()
		}, planets)

		if (collisionResult && !wasLastTickCollision) {
			ticksWithCollisions.push(tick)
			wasLastTickCollision = true
			console.log('## collisionResult, tick', + tick)
			ticks.push({
				velocity: collisionResult.newVelocity,
				position: collisionResult.contactPoint.clone(),
			})
		} else {
			wasLastTickCollision = false
			ticks.push({
				velocity: lastTick.velocity.clone().add(calcVelocityChangeAfterGravityTick(ticksPerSecond, ball, planets)),
				position: lastTick.position.clone().add(lastTick.velocity.clone().multiplyScalar(1))
			})
		}
	}

	return { ticks, ticksWithCollisions }
}

function calcVelocityChangeAfterGravityTick(ticksPerSecond: number, ball: Ball, planets: Planet[]) {
	const tickDuration = 1000 / ticksPerSecond / 10000
	const velocityChange = new Vector3(0, 0, 0)

	planets.forEach((planet: Planet) => {
		velocityChange.add(
			calcGravityForce({ puller: planet, pulled: ball, timeDelta: tickDuration })
		);
	});

	return velocityChange
}

function bounceBallOffPlanets(ball: Pick<Ball, 'velocity' | 'radius' | 'position'>, planets: Planet[]): CollisionResult | null {
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

			const contactPoint = adjustBallPositionAfterCollision(ball, planet)
			if (newVelocity.length() < 0.2) {
				collisionResult = {
					newVelocity: new Vector3(0, 0, 0),
					contactPoint,
					stopsBall: true
				}
			} else {
				collisionResult = {
					newVelocity,
					contactPoint,
					stopsBall: false
				}
			}

			return true
		}

		return false
	});

	return collisionResult
}
