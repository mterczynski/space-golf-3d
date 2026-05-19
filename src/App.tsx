import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { SpaceGolfScene } from "./components/SpaceGolfScene";
import { getSettings, SettingsManager } from "./SettingsManager";
import { InfoTab } from "./InfoTab";

export function App() {
	const settings = getSettings();
	const settingsManagerRef = useRef<SettingsManager | null>(null);

	useEffect(() => {
		const manager = new SettingsManager();
		settingsManagerRef.current = manager;

		manager.setRestartCallback(() => {
			window.location.reload();
		});

		InfoTab.setVisible(settings.showInfoTab);

		return () => {
			manager.destroy();
		};
	}, []);

	return (
		<Canvas
			camera={{
				fov: settings.camera.fov,
				near: settings.camera.near,
				far: settings.camera.far,
				position: [600, 0, 0],
			}}
			style={{ width: "100vw", height: "100vh" }}
			gl={{ antialias: true }}
		>
			<Suspense fallback={null}>
				<SpaceGolfScene />
			</Suspense>
		</Canvas>
	);
}
