import { Bullet } from "./Bullet";

export abstract class InfoTab{
    static updateText(bullet: Bullet){
        document.getElementById('infoTab__text')!.innerHTML = 
        `Bullet: {
            position:{
                x: ${bullet.position.x.toFixed(0)},
                y: ${bullet.position.y.toFixed(0)},
                z: ${bullet.position.z.toFixed(0)}
            }
            velocity:{
                length: ${bullet.velocity.length().toFixed(2)},
                x: ${bullet.velocity.x.toFixed(2)},
                y: ${bullet.velocity.y.toFixed(2)},
                z: ${bullet.velocity.z.toFixed(2)}
            } 
        }`;
    }
}