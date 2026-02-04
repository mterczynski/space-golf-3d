import { Ball } from "../Ball";
import { Group } from "three";

// Mock the settings to enable rocket model
jest.mock("../../settings", () => ({
	settings: {
		ball: {
			bounciness: 0.8,
			launchForce: 3.5,
			radius: 8,
			showVelocityVector: false,
			traceDuration: 5,
			traceTransparency: 0.6,
			useRocketModel: true,
		},
		camera: {
			fov: 30,
			near: 0.1,
			far: Math.pow(10, 6),
		},
		simulationMode: false,
	},
}));

describe("Ball with rocket model", () => {
	test("should create ball with rocket geometry when useRocketModel is true", () => {
		const ball = new Ball();

		// The ball should have children (the rocket group)
		expect(ball.children.length).toBeGreaterThan(0);

		// One of the children should be a Group (the rocket)
		const hasGroup = ball.children.some((child) => child instanceof Group);
		expect(hasGroup).toBe(true);
	});

	test("should maintain correct radius", () => {
		const customRadius = 10;
		const ball = new Ball({ radius: customRadius });

		expect(ball.radius).toBe(customRadius);
	});
});
