import { Ball } from './meshes/Ball';

const htmlElement = document.getElementById('infoTab__text') as HTMLPreElement;

export const InfoTab = {
	updateText(ball: Ball) {
		const content =
`Ball: {
	position: {
		x: ${ball.position.x.toFixed(0)},
		y: ${ball.position.y.toFixed(0)},
		z: ${ball.position.z.toFixed(0)}
	},
	velocity: {
		length: ${ball.getVelocity().length().toFixed(2)},
		x: ${ball.getVelocity().x.toFixed(2)},
		y: ${ball.getVelocity().y.toFixed(2)},
		z: ${ball.getVelocity().z.toFixed(2)}
	}
}`;

		htmlElement.innerHTML = content;
	}
};
