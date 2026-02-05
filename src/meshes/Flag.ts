import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshPhongMaterial } from "three";

const POLE_RADIUS = 0.5;
const POLE_SEGMENTS = 16;
const FLAG_SIZE_RATIO = 0.35;
const FLAG_ELEMENT_THICKNESS = 0.2;

/**
 * Golf hole flag marker - consists of a metallic pole with a triangular flag marker
 */
export class Flag extends Group {
	constructor(params?: { poleLength?: number }) {
		super();
		
		const len = params?.poleLength || 10;
		
		// Metallic vertical pole
		const rodGeometry = new CylinderGeometry(POLE_RADIUS, POLE_RADIUS, len, POLE_SEGMENTS);
		const silverMaterial = new MeshPhongMaterial({ color: 0xc0c0c0 });
		const rod = new Mesh(rodGeometry, silverMaterial);
		this.add(rod);

		// Green triangular flag marker - using boxes to form triangle
		const clothSize = len * FLAG_SIZE_RATIO;
		const greenMaterial = new MeshPhongMaterial({ color: 0x00ff00 });
		
		// Create triangle from 3 thin boxes
		const box1 = new Mesh(new BoxGeometry(clothSize, FLAG_ELEMENT_THICKNESS, FLAG_ELEMENT_THICKNESS), greenMaterial);
		const box2 = new Mesh(new BoxGeometry(FLAG_ELEMENT_THICKNESS, clothSize, FLAG_ELEMENT_THICKNESS), greenMaterial);
		const box3 = new Mesh(new BoxGeometry(clothSize * 1.1, FLAG_ELEMENT_THICKNESS, FLAG_ELEMENT_THICKNESS), greenMaterial);
		
		box1.position.set(clothSize / 2, len / 2, 0);
		box2.position.set(0, len / 2, 0);
		box3.position.set(clothSize / 2.2, len / 2 - clothSize / 2.2, 0);
		box3.rotateZ(-Math.PI / 4);
		
		this.add(box1);
		this.add(box2);
		this.add(box3);
	}
}
