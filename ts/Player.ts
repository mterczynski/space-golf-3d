import { Mesh, Vector3 } from "three";

export class Player{
    private _name = "Player";
    private mesh: Mesh;
    private health: number;
    private velocity = new Vector3();

    public get name(){
        return this._name;
    }
}