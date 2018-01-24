import { Mesh, BackSide, SphereGeometry, MeshBasicMaterial, BufferGeometry, Color, Vector3, ImageUtils, MeshPhongMaterial } from 'three';
import { Bullet } from './Bullet';

export class Planet extends Mesh {

    constructor(public readonly size:number, color = new Color('rgb(255,0,0)')){
        super(new SphereGeometry(size, 32, 32), new MeshPhongMaterial({color}));
        const shadowMesh = new Mesh(new SphereGeometry(size + 1, 32, 32), this.shadowMat);
        this.add(shadowMesh);
    }
    
    private readonly shadowMat = new MeshBasicMaterial({
        color: 'rgb(0,0,0)',
        side: BackSide
    });

    get gravity(){
        return this.size/Math.pow(10, 3.5);
    }
    get name(){
        return 'Planet';
    }

    set name(_){
        console.warn('name is readonly');
    }  

    calcGravity(bullet: Bullet): Vector3{
        if(bullet.position.distanceTo(this.position) < this.size * 10){
            return new Vector3().subVectors(this.position, bullet.position).normalize().multiplyScalar(this.gravity);
        } else {
            return new Vector3();
        }
    }
}