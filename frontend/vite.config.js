import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		open: true,
	},
	resolve: {
		alias: {
			admin: path.resolve(__dirname, 'src/admin'),
			assets: path.resolve(__dirname, 'src/assets'),
			hocs: path.resolve(__dirname, 'src/hocs'),
			hooks: path.resolve(__dirname, 'src/hooks'),
			routes: path.resolve(__dirname, 'src/routes'),
			shared: path.resolve(__dirname, 'src/shared'),
			stores: path.resolve(__dirname, 'src/stores'),
			users: path.resolve(__dirname, 'src/users'),
			utils: path.resolve(__dirname, 'src/utils'),
		},
	},
});
