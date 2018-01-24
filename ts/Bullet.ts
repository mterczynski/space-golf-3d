import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3 } from "three";
import { Planet } from "./Planet";

export class Bullet extends Mesh{
    constructor(){
        super(new SphereGeometry(Bullet.size, 32, 32), new MeshBasicMaterial({
            color: 0x000000,
        }));
    }

    public static readonly _name = "Bullet"
    private static readonly size = 5;
    private velocity = new Vector3();
    private readonly maxSpeed = new Vector3(3, 3, 3);
    private readonly minSpeed = this.maxSpeed.multiplyScalar(-1);

    addVelocity(vector: Vector3){
        this.velocity = this.velocity.add(vector);
        // this.velocity.clamp(this.minSpeed, this.maxSpeed);
    }

    isColliding(planet: Planet){
        if(this.position.distanceTo(planet.position) <= Bullet.size + planet.size){
            console.log('collision')
            return true;
        } else {
            return false;
        }
    }

    isCollidingWithAny(planets: [Planet]){
        return planets.some((planet)=>{
            return this.isColliding(planet);
        });
    }

    tick(){
        this.position.add(this.velocity);
    }
}