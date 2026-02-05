import {
	BufferGeometry,
	ConeGeometry,
	CylinderGeometry,
	Float32BufferAttribute,
	Group,
	Mesh,
	MeshBasicMaterial,
} from "three";

/**
 * Creates a triangular fin geometry using BufferGeometry
 * @param width - Width of the fin base
 * @param height - Height of the fin
 * @returns BufferGeometry for a triangular fin
 */
export function createTriangularFinGeometry(width: number, height: number): BufferGeometry {
	// Create a triangular fin using BufferGeometry
	const geometry = new BufferGeometry();
	
	// Define vertices for a triangular fin (pyramid with triangular base)
	const vertices = new Float32Array([
		// Front face (triangle)
		0, height, 0,           // top point
		-width/2, 0, width/2,   // bottom left
		width/2, 0, width/2,    // bottom right
		
		// Back face (triangle)
		0, height, 0,           // top point
		width/2, 0, -width/2,   // bottom right back
		-width/2, 0, -width/2,  // bottom left back
		
		// Left face (triangle)
		0, height, 0,           // top point
		-width/2, 0, -width/2,  // bottom left back
		-width/2, 0, width/2,   // bottom left front
		
		// Right face (triangle)
		0, height, 0,           // top point
		width/2, 0, width/2,    // bottom right front
		width/2, 0, -width/2,   // bottom right back
	]);
	
	geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
	geometry.computeVertexNormals();
	
	return geometry;
}

/**
 * Creates a rocket geometry group with body, nose cone, and fins
 * @param ballRadius - Base radius to scale the rocket proportionally
 * @returns Group containing the complete rocket model
 */
export function createRocketGeometry(ballRadius: number): Group {
	const group = new Group();
	
	// Rocket body (cylinder) - made slightly wider and shorter
	const bodyHeight = ballRadius * 2.2;
	const bodyRadius = ballRadius * 0.45;
	const bodyGeometry = new CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 16);
	const body = new Mesh(bodyGeometry);
	body.position.y = 0;
	group.add(body);
	
	// Rocket nose cone - made more pointed
	const noseHeight = ballRadius * 1.0;
	const noseGeometry = new ConeGeometry(bodyRadius, noseHeight, 16);
	const nose = new Mesh(noseGeometry);
	nose.position.y = bodyHeight / 2 + noseHeight / 2;
	group.add(nose);
	
	// Rocket fins (4 triangular fins) - RED and properly sized
	const finWidth = ballRadius * 1.2;
	const finHeight = ballRadius * 1.0;
	const redMaterial = new MeshBasicMaterial({ color: 0xff0000 }); // Red color
	
	for (let i = 0; i < 4; i++) {
		const finGeometry = createTriangularFinGeometry(finWidth, finHeight);
		const fin = new Mesh(finGeometry, redMaterial);
		
		const angle = (i * Math.PI) / 2;
		fin.position.x = Math.cos(angle) * bodyRadius;
		fin.position.z = Math.sin(angle) * bodyRadius;
		fin.position.y = -bodyHeight / 2;
		
		// Rotate fin to point outward
		fin.rotation.y = angle;
		
		group.add(fin);
	}
	
	// Rotate the entire rocket to point forward (along z-axis)
	group.rotation.x = Math.PI / 2;
	
	return group;
}
