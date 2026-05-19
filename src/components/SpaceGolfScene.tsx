import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Ball } from "../meshes/Ball";
import { Planet } from "../meshes/Planet";
import { getSettings } from "../SettingsManager";
import { generateRandomLevel } from "../utils/generateRandomLevel";
import { createTestLevel } from "../utils/createTestLevel";
import { areSpheresColliding, calcGravityForce, calcVelocityAfterRebound } from "../utils";
import { adjustBallPositionAfterCollision } from "../utils/adjustBallPositionAfterCollision";
import { launchBall } from "../utils/launchBall";
import { playSound } from "../utils/playSound";
import { InfoTab } from "../InfoTab";
import { ProceduralSkyboxScene } from "./ProceduralSkyboxScene";

export function SpaceGolfScene() {
	const settings = useMemo(() => getSettings(), []);

	const level = useMemo(
		() => (settings.useRandomLevel ? generateRandomLevel() : createTestLevel()),
		[] // level is determined once on mount; `settings` is module-level and stable
	);

	const planets = useMemo(
		() =>
			level.planets.map((p) => {
				const planet = new Planet({ radius: p.radius, color: p.color, textureUrl: p.textureUrl });
				planet.position.set(p.position.x, p.position.y, p.position.z);
				return planet;
			}),
		[] // planets are created once; `level` is stable after first render
	);

	const ball = useMemo(() => {
		const b = new Ball();
		b.position.set(level.initialBallPosition.x, level.initialBallPosition.y, level.initialBallPosition.z);
		planets.forEach((planet) => {
			if (areSpheresColliding(planet, b)) {
				b.landedPlanet = planet;
			}
		});
		return b;
		// ball is created once; `level` and `planets` are stable after first render
	}, []);

	// Track whether the ball has landed (for OrbitControls and camera mode)
	const [isAiming, setIsAiming] = useState(ball.landedPlanet !== null);
	const isAimingRef = useRef(ball.landedPlanet !== null);
	const wasLandedRef = useRef(ball.landedPlanet !== null);

	const setIsAimingBoth = useCallback((value: boolean) => {
		isAimingRef.current = value;
		setIsAiming(value);
	}, []);

	const accumulatedTime = useRef(0);
	const autoRotateStartTime = useRef(Date.now());
	const traceGroupRef = useRef<THREE.Group>(null);
	const orbitControlsRef = useRef<OrbitControlsImpl>(null);

	const { camera } = useThree();

	// Ambient sound on first user interaction
	useEffect(() => {
		const events = ["mousedown", "keypress", "touchstart"] as const;
		const handleFirst = () => {
			playSound.ambient();
			events.forEach((e) => removeEventListener(e, handleFirst));
		};
		events.forEach((e) => addEventListener(e, handleFirst));
		return () => events.forEach((e) => removeEventListener(e, handleFirst));
	}, []);

	// Space key launches ball in non-simulation mode
	useEffect(() => {
		if (settings.simulationMode) return;

		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === " " && ball.landedPlanet) {
				const directionVector = ball.position.clone().sub(camera.position.clone());
				launchBall(ball, directionVector, planets);
				autoRotateStartTime.current = Date.now();
				setIsAimingBoth(false);
			}
		};

		addEventListener("keypress", handleKeyPress);
		return () => removeEventListener("keypress", handleKeyPress);
	}, [ball, camera, planets, settings.simulationMode, setIsAimingBoth]);

	// Physics + rendering loop
	useFrame((state, delta) => {
		const fixedDelta = 1 / settings.ticksPerSecond;

		// Detect landing / take-off transitions to keep isAimingRef in sync
		const isLanded = ball.landedPlanet !== null;
		if (isLanded && !wasLandedRef.current) {
			// Ball just landed
			if (!settings.simulationMode) {
				setIsAimingBoth(true);
				orbitControlsRef.current?.target.copy(ball.position);
				orbitControlsRef.current?.update();
			}
		} else if (!isLanded && wasLandedRef.current) {
			// Ball just launched (handles simulation-mode auto-launches)
			autoRotateStartTime.current = Date.now();
			setIsAimingBoth(false);
		}
		wasLandedRef.current = isLanded;

		// Auto-rotate camera around ball when it is in flight
		if (!isAimingRef.current) {
			const elapsed = Date.now() - autoRotateStartTime.current;
			const orbitRadius = 2e3;
			const speed = 0.000064 * settings.camera.rotationSpeed;
			state.camera.position.set(
				Math.sin(elapsed * speed) * orbitRadius,
				Math.abs(Math.cos(elapsed * speed)) * orbitRadius,
				Math.cos(elapsed * speed) * orbitRadius
			);
			state.camera.lookAt(ball.position);
			(state.camera as THREE.PerspectiveCamera).aspect = innerWidth / innerHeight;
			state.camera.updateProjectionMatrix();
		}

		// Fixed-timestep physics
		accumulatedTime.current += delta;
		if (!settings.usePreCalculatedFlight) {
			while (accumulatedTime.current >= fixedDelta) {
				// Bounce ball off planets
				planets.forEach((planet) => {
					if (areSpheresColliding(planet, ball)) {
						const newVelocity = calcVelocityAfterRebound({ staticSphere: planet, movingSphere: ball });

						if (settings.simulationMode) {
							console.log(
								"## simulation",
								"hit",
								ball.position
									.toArray()
									.map((i) => Math.floor(i))
									.toString()
							);
						}

						const hitSoundVolume = Math.min(1, ball.velocity.length() / 5);
						playSound.ballHit(hitSoundVolume);
						ball.velocity = newVelocity;
						adjustBallPositionAfterCollision(ball, planet);

						if (ball.velocity.length() < 0.2 && !ball.landedPlanet) {
							stopBall(ball, planet);
						}
					}
				});

				// Apply gravity from all planets
				planets.forEach((planet) => {
					ball.addVelocity(calcGravityForce({ puller: planet, pulled: ball, timeDelta: fixedDelta }));
				});

				accumulatedTime.current -= fixedDelta;
			}
		}

		// Advance ball (position, pre-calculated flight, trace vertices, etc.)
		ball.tick(planets);

		// Refresh the ball's flight trace
		if (traceGroupRef.current) {
			traceGroupRef.current.clear();
			traceGroupRef.current.add(ball.createTrace());
		}

		InfoTab.updateText(ball);
	});

	function stopBall(b: Ball, planet: Planet) {
		b.landedPlanet = planet;
		if (!settings.simulationMode) {
			setIsAimingBoth(true);
			orbitControlsRef.current?.target.copy(b.position);
			orbitControlsRef.current?.update();
		}
	}

	return (
		<>
			{/* Main scene light */}
			<pointLight position={[0, 100, 5000]} intensity={50_000_000} />

			{/* Planets */}
			{planets.map((planet, i) => (
				<primitive key={i} object={planet} />
			))}

			{/* Ball */}
			<primitive object={ball} />

			{/* Ball flight trace */}
			<group ref={traceGroupRef} />

			{/* Skybox */}
			<ProceduralSkyboxScene />

			{/* Orbit controls — active when ball has landed and player is aiming */}
			<OrbitControls ref={orbitControlsRef} enabled={isAiming} />

			{settings.showFPSCounter && <Stats />}
		</>
	);
}
