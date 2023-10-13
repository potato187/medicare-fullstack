import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

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
			reduxStores: path.resolve(__dirname, 'src/reduxStores'),
			components: path.resolve(__dirname, 'src/components'),
			constant: path.resolve(__dirname, 'src/constant'),
			api: path.resolve(__dirname, 'src/api'),
			hocs: path.resolve(__dirname, 'src/hocs'),
			hooks: path.resolve(__dirname, 'src/hooks'),
			routes: path.resolve(__dirname, 'src/routes'),
			stores: path.resolve(__dirname, 'src/stores'),
			utils: path.resolve(__dirname, 'src/utils'),
		},
	},
});
