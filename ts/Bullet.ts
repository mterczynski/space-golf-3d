import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3 } from "three";
import { Planet } from "./Planet";

export class Bullet extends Mesh{
    constructor(){
        super(new SphereGeometry(5, 32, 32), new MeshBasicMaterial({
            color: 0x000000,
        }));
    }

    private velocity = new Vector3();

    addVelocity(planets: [Planet]){
        // todo
    }

    calcCollisions(planets: [Planet]){
        // todo
    }
}