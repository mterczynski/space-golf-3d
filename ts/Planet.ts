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
    public readonly density = 5;

    get acceleration(){
        return Math.pow(this.size, 3) / Math.pow(10, 3);
    }
    get mass(){
        return this.density * 4/3 * Math.PI * Math.pow(this.size, 3);
    }
    get name(){
        return 'Planet';
    }
    set name(_){
        console.warn('name is readonly');
    }  

    calcGravity(bullet: Bullet): Vector3{
        let distance = bullet.position.distanceTo(this.position);
        let scalar = this.acceleration / Math.pow(distance,2);
        return new Vector3().subVectors(this.position, bullet.position).normalize().multiplyScalar(scalar);
    }
}