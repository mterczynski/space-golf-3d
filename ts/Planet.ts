import { Mesh, BackSide, SphereGeometry, MeshBasicMaterial, BufferGeometry } from 'three';

export class Planet extends Mesh {
    
    constructor(private size:number, material:THREE.MeshBasicMaterial){
        super(new SphereGeometry(size, 32, 32), material);

        this.add(new Mesh(<BufferGeometry>this.geometry.clone().scale(1.05, 1.05, 1.05), this.shadowMat));
    }

    private shadowMat = new MeshBasicMaterial({
        color: 0x000000,
        side: BackSide
    });    

    private shadowGeo = this.geometry.clone();
    public static readonly _name = "Planet";

    

    get gravity(){
        return this.size/100;
    }

    get name(){
        return Player._name;
    }
}