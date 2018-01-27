import { Mesh, Vector3, PerspectiveCamera } from "three";
import { Tickable } from "./interfaces/Tickable";

export class Player implements Tickable{
    private mesh: Mesh;
    private health: number;
    private velocity = new Vector3();
    private camera = new PerspectiveCamera(45, innerWidth/innerHeight, 0.1, Math.pow(10,6));

    private updateCamera(){
        this.camera.aspect = innerWidth/innerHeight;
        this.camera.updateProjectionMatrix();
    }

    get name(){
        return "Player";
    }
    set name(_){
        console.warn('name setter is private');
    }

    tick(){
        this.updateCamera();
    }
}