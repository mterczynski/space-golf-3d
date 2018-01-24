import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3 } from "three";
import { Planet } from "./Planet";

export class Bullet extends Mesh{
    constructor(){
        super(new SphereGeometry(Bullet.size, 32, 32), new MeshBasicMaterial({
            color: 'rgb(0,0,0)',
        }));
    }

    private static readonly size = 5;
    private velocity = new Vector3();
    get name(){ return 'Bullet' }
    set name(_){ console.warn('name is readonly') }

    addVelocity(vector: Vector3){
        this.velocity = this.velocity.add(vector);
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