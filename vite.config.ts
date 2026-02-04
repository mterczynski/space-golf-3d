import { defineConfig } from "vite";

export default defineConfig({
	// Use absolute base path for GitHub Pages subdirectory deployments
	base: "/space-golf-3d/",
	build: {
		rollupOptions: {
			// Use experimental Rolldown bundler (faster Rust-based alternative to Rollup)
			// @ts-expect-error - rolldown is experimental
			bundler: 'rolldown',
		}
	}
});
