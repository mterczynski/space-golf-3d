import { Ball } from "./Ball";

export abstract class InfoTab{
    static updateText(ball: Ball){
        document.getElementById('infoTab__text')!.innerHTML = 
        `Ball: {
            position:{
                x: ${ball.position.x.toFixed(0)},
                y: ${ball.position.y.toFixed(0)},
                z: ${ball.position.z.toFixed(0)}
            }
            velocity:{
                length: ${ball.getVelocity().length().toFixed(2)},
                x: ${ball.getVelocity().x.toFixed(2)},
                y: ${ball.getVelocity().y.toFixed(2)},
                z: ${ball.getVelocity().z.toFixed(2)}
            } 
        }`;
    }
}