import { Mesh, Vector3 } from "three";
import { Ball } from "../../meshes/Ball";
import {adjustBallPositionAfterCollision} from '../adjustBallPositionAfterCollision';

describe('adjustBallPositionAfterCollision', () => {
	it('brings ball back on the level of the planet surface if the ball is partially inside of the planet', () => {
		const ball: Ball = new Ball({radius: 3});
		ball.position.set(0, 23.5, 0);

		const planetSphere = {
			position: new Vector3(0, 1, 0),
			radius: 20
		};
		
		adjustBallPositionAfterCollision(ball, planetSphere);

		expect(ball.position).toEqual(new Vector3(0, 24, 0));
	});
});
