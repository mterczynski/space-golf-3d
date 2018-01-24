import { Mesh, Vector3 } from "three";

export class Player{
    private mesh: Mesh;
    private health: number;
    private velocity = new Vector3();

    public get name(){
        return "Player";
    }

    public set name(_){
        console.warn('name setter is private');
    }
}