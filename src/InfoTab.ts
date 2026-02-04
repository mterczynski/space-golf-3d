import { Ball } from "./meshes/Ball";
import { settings } from "./settings";

const infoTab = document.getElementById("infoTab") as HTMLPreElement;
const infoTabText = document.getElementById("infoTab__text") as HTMLPreElement;

export const InfoTab = {
	updateText(ball: Ball) {
		const content = `Ball: {
	position: {
		x: ${ball.position.x.toFixed(0)},
		y: ${ball.position.y.toFixed(0)},
		z: ${ball.position.z.toFixed(0)}
	},
	velocity: {
		length: ${ball.velocity.length().toFixed(2)},
		x: ${ball.velocity.x.toFixed(2)},
		y: ${ball.velocity.y.toFixed(2)},
		z: ${ball.velocity.z.toFixed(2)}
	}
}`;

		infoTabText.innerHTML = content;
	},
};

if (!settings.showInfoTab) {
	infoTab.style.display = "none";
}
