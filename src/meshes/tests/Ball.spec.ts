import { Ball } from "../Ball";
import { Vector3, Line } from "three";

describe("Ball", () => {
	test("addVelocity should work", () => {
		const ball = new Ball();
		const vel1 = new Vector3(2, 2, 2);
		const vel2 = new Vector3(0, 1, 2);

		ball.addVelocity(vel1);
		ball.addVelocity(vel2);

		expect(ball.velocity).toEqual(new Vector3(2, 3, 4));
	});
	test("set velocity should work", () => {
		const ball = new Ball();
		ball.velocity = new Vector3(1, 2, 3);

		expect(ball.velocity).toEqual(new Vector3(1, 2, 3));
	});
	test(`get velocity should return clone of ball's velocity`, () => {
		const ball = new Ball();
		ball.velocity = new Vector3(1, 2, 3);

		const result = ball.velocity;
		result.set(2, 3, 4);

		expect(ball.velocity).toEqual(new Vector3(1, 2, 3));
	});
	test("createTrace should return new trace", () => {
		const ball = new Ball();

		const trace = ball.createTrace();

		expect(trace).toBeInstanceOf(Line);
	});
});
