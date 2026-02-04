import { defineConfig } from "vite";

export default defineConfig({
	// Use absolute base path for GitHub Pages subdirectory deployments
	base: "/space-golf-3d/",
	build: {
		rollupOptions: {
			// Use experimental Rolldown bundler (faster Rust-based alternative to Rollup)
			// @ts-ignore - rolldown is experimental
			bundler: 'rolldown',
		}
	}
});
