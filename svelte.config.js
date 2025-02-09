import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.mdx'],
	// Consult https://svelte.dev/docs/kit/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.mdx'],
			layout: {
				blog: './src/lib/components/mdx-layout.svelte'
			}
		})
	],

	kit: {
		// adapter-auto only supports certain environments.adapter-auto only supports certain environments. See https://kit.svelte.dev/docs/adapter-auto for details.
		adapter: adapter()
	},
	vitePlugin: {
		inspector: {
			enabled: true
		}
	}
};

export default config;
