import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3, ArrowHelper, LineBasicMaterial, Geometry, Line } from "three";
import { Planet } from "./Planet";

export class Bullet extends Mesh{
    constructor(){
        super(new SphereGeometry(Bullet.size, 32, 32), new MeshBasicMaterial({
            color: 'rgb(0,250,250)',
        }));
        this.add(this.arrowHelper);
    }

    private static readonly size = 3;
    private _velocity = new Vector3(-0.5, 0.5, 0);
    private arrowHelper = new ArrowHelper(new Vector3(), new Vector3(), 50);
    private pathVerticies: Vector3[] = [];

    get name(){ return 'Bullet' }
    set name(_){ console.warn('name is readonly') }

    get velocity(){
        return this._velocity.clone();
    }

    getLine(){
        var lineMaterial = new LineBasicMaterial({
            color: 0xff0000
        });

        var geometry = new Geometry();

        geometry.vertices = this.pathVerticies;

        return new Line( geometry, lineMaterial );
    }

    private updateArrowHelper(){
        this.arrowHelper.setDirection(this._velocity.clone().normalize());
        this.arrowHelper.setLength(this._velocity.length() * 20);
    }
    addVelocity(vector: Vector3){
        this._velocity = this._velocity.add(vector);
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
        this.position.add(this._velocity);
        this.updateArrowHelper();
        this.pathVerticies.push(this.position.clone());
    }
}