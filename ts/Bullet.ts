import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3 } from "three";
import { Planet } from "./Planet";

export class Bullet extends Mesh{
    constructor(){
        super(new SphereGeometry(5, 32, 32), new MeshBasicMaterial({
            color: 0x000000,
        }));
    }

    private velocity = new Vector3();
    private readonly maxSpeed = new Vector3(3, 3, 3);
    private readonly minSpeed = this.maxSpeed.multiplyScalar(-1);

    addVelocity(vector: Vector3){
        this.velocity = this.velocity.add(vector);
        // this.velocity.clamp(this.minSpeed, this.maxSpeed);
    }

    calcCollisions(planets: [Planet]){
        // todo
    }

    tick(){
        this.position.add(this.velocity);
    }
}