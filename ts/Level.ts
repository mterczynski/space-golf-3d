import { Color, Vector3 } from "three";

interface PlanetInterface{
    size: number,
    color: Color,
    position: Vector3
}

export class Level{
    planets: PlanetInterface[]
}