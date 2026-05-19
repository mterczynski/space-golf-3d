import { BackSide, Color } from "three";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { getSettings } from "../SettingsManager";

const SKYBOX_RADIUS = 10 ** 5.8;
const SUN_RADIUS = SKYBOX_RADIUS * 0.9;
const SUN_X = SUN_RADIUS * 0.7;
const SUN_Y = -SUN_RADIUS * 0.3;
const SUN_Z = SUN_RADIUS * 0.6;
const SUN_PULSE_SPEED = 2;
const SUN_MIN_INTENSITY = 0.2;
const SUN_MAX_INTENSITY = 0.5;

export function ProceduralSkyboxScene() {
	const settings = getSettings();
	const sunLightRef = useRef<THREE.PointLight>(null);
	const sunMeshRef = useRef<THREE.Mesh>(null);
	const animTime = useRef(0);

	useFrame((_, delta) => {
		animTime.current += delta;
		const intensity =
			SUN_MIN_INTENSITY +
			(SUN_MAX_INTENSITY - SUN_MIN_INTENSITY) *
				(Math.sin(animTime.current * SUN_PULSE_SPEED) * 0.5 + 0.5);

		if (sunLightRef.current) {
			sunLightRef.current.intensity = intensity;
		}
		if (sunMeshRef.current) {
			(sunMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 + intensity * 0.4;
		}
	});

	return (
		<>
			{/* Sky background sphere */}
			<mesh>
				<sphereGeometry args={[SKYBOX_RADIUS, 64, 64]} />
				<meshBasicMaterial
					side={BackSide}
					color={new Color(0, 0, 0.015)}
					transparent
					opacity={settings.skybox.opacity}
				/>
			</mesh>

			{/* Procedural star field */}
			<Stars radius={SUN_RADIUS * 0.95} depth={50} count={3000} factor={400} saturation={0} fade />

			{/* Distant sun mesh */}
			<mesh ref={sunMeshRef} position={[SUN_X, SUN_Y, SUN_Z]}>
				<sphereGeometry args={[5000, 32, 32]} />
				<meshBasicMaterial color={new Color(1.0, 0.3, 0.2)} transparent opacity={0.8} />
			</mesh>

			{/* Sun point light for red glow effect */}
			<pointLight
				ref={sunLightRef}
				color={new Color(1.0, 0.2, 0.1)}
				intensity={SUN_MIN_INTENSITY}
				position={[SUN_X, SUN_Y, SUN_Z]}
			/>
		</>
	);
}
