import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";

export class Net extends Mesh{
    constructor(){
        let geo = new PlaneGeometry(1000, 1000, 100, 100);
        let mat = new MeshBasicMaterial({
            color: 'rgb(0,0,255)', 
            wireframe: true,
            side: DoubleSide
        });
        super(geo, mat);
    }
}