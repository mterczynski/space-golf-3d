import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshPhongMaterial } from "three";

/**
 * Golf hole flag marker - consists of a metallic pole with a cloth indicator
 */
export class Flag extends Group {
	constructor(params?: { poleLength?: number }) {
		super();
		
		const len = params?.poleLength || 10;
		
		// Metallic vertical pole
		const rodDiameter = 0.5;
		const rodSegments = 16;
		const rodGeometry = new CylinderGeometry(rodDiameter, rodDiameter, len, rodSegments);
		const silverMaterial = new MeshPhongMaterial({ color: 0xc0c0c0 });
		const rod = new Mesh(rodGeometry, silverMaterial);
		this.add(rod);

		// Green cloth indicator - using boxes to form triangle
		const clothSize = len * 0.35;
		const greenMaterial = new MeshPhongMaterial({ color: 0x00ff00 });
		
		// Create triangle from 3 thin boxes
		const boxThickness = 0.2;
		const box1 = new Mesh(new BoxGeometry(clothSize, boxThickness, boxThickness), greenMaterial);
		const box2 = new Mesh(new BoxGeometry(boxThickness, clothSize, boxThickness), greenMaterial);
		const box3 = new Mesh(new BoxGeometry(clothSize * 1.1, boxThickness, boxThickness), greenMaterial);
		
		box1.position.set(clothSize / 2, len / 2, 0);
		box2.position.set(0, len / 2, 0);
		box3.position.set(clothSize / 2.2, len / 2 - clothSize / 2.2, 0);
		box3.rotateZ(-Math.PI / 4);
		
		this.add(box1);
		this.add(box2);
		this.add(box3);
	}
}
