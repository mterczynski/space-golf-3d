import { calcGravityForce } from '../calcGravityForce'
import { Planet } from '../../meshes/Planet'
import { Ball } from '../../meshes/Ball';

describe('calcGravityForce', () => {
	test(`gravity force should be equal to masses of two objects multiplied by each other,
	  and divided by square of distance between these two objects
	`, () => {
		const planet = new Planet({radius: 10});
		const ball = new Ball();
		const planetX = 5;
		const ballX = 20;

		planet.position.set(planetX, 0, 0); // there will be planet's circuit at x=15
		ball.position.set(ballX, 0, 0); // there will be ball's circuit at x=17

		const distance = Math.abs(ballX - planetX);

		expect(calcGravityForce(planet, ball)).toBe(ball.mass * planet.mass / (distance ** 2));
	});
})
