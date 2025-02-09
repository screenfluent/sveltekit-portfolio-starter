# SvelteKit Migration Technical Plan

## 1. Project Structure Mapping

````diff
Next.js                      → SvelteKit
|- app/                      → src/routes/
|  |- layout.tsx             → src/routes/+layout.svelte
|  |- page.tsx               → src/routes/+page.svelte
|  |- blog                  → src/routes/blog/
|  |  |- [slug]/page.tsx     → src/routes/blog/[slug]/+page.svelte
|  |  |- posts/             → src/content/blog/
|  |      |- spaces-vs-tabs.mdx    → (processed with mdsvex)
|  |      |- static-typing.mdx       → (processed with mdsvex)
|  |      |- vim.mdx                → (processed with mdsvex)
|  |- utils.ts               → src/lib/utilities/
|  |- components/            → src/lib/components/
|  |- og/                   → src/routes/og/
|  |- rss/                  → src/routes/rss/
|  |- global.css            → src/app.css (imported in +layout.svelte)
|  |- not-found.tsx         → src/routes/+error.svelte
|  |- robots.ts             → src/routes/robots.txt/+server.ts
|  |- sitemap.ts            → src/routes/sitemap.xml/+server.ts
|- lib/                      → src/lib/utilities/
|- public/                   → static/

Note: Blog posts will be stored in src/content/blog/ and loaded via:
1. Centralized content loader in src/lib/content.ts
2. Type-safe route loading with $content path alias
3. Prerendered routes using:
   ```svelte
   <!-- +page.svelte -->
   <script>
   export const prerender = true;
   </script>
````

## 2. Routing Migration Strategy

### Page Routes

```ts
<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
	// Svelte 5 runes for props and data handling
	let { data } = $props<{ data: PageData }>();

	// Example of state management with runes
	let count = $state(0);
	let doubled = $derived(count * 2);

	// Side effects with runes
	$effect(() => {
		console.log(`Data changed: ${data}`);
	});
</script>
```

### Dynamic Routes

```diff
app/blog/[slug]/page.tsx → src/routes/blog/[slug]/+page.svelte
```

### Route Data Loading

```ts
// src/routes/blog/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import { getPost } from '$lib/content';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const post = await getPost(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post: {
			slug: params.slug,
			metadata: post.metadata,
			Component: post.default
		}
	};
}) satisfies PageServerLoad<{
	post: {
		slug: string;
		metadata: BlogPost['metadata'];
		Component: BlogPost['default'];
	};
}>;
```

## 3. Data Fetching Conversion

| Next.js Pattern    | SvelteKit Equivalent |
| ------------------ | -------------------- |
| getStaticProps     | +page.server.js load |
| getServerSideProps | +page.server.js load |
| API Routes         | +server.js endpoints |

## 4. Component Migration Checklist

- [ ] Convert React components to Svelte syntax
- [ ] Replace useState → $state runes
- [ ] Migrate useEffect → $effect
- [ ] Convert props handling → $props

## 5. Styling Strategy

```javascript
// svelte.config.js
export default {
	preprocess: preprocess({
		postcss: true // Enable Tailwind
	})
};
```

## 6. API Routes Conversion

```javascript
// src/routes/api/projects/+server.ts
export const GET = async () => {
	return json(await getProjects());
};
```

## 7. Configuration Changes

| File                 | Changes Needed                |
| -------------------- | ----------------------------- |
| package.json         | Update scripts & dependencies |
| tsconfig.json        | SvelteKit base config         |
| svelte.config.js     | New adapter setup             |
| .npmrc → bunfig.toml | Completed in previous step    |

## 8. Testing Strategy

1. Component-level tests with Vitest
2. E2E navigation tests via Playwright
3. Data loading validation
4. Static generation verification

## 9. Deployment Plan

```markdown
- Use adapter-static for SSG
- Configure prerender in +page.ts:
```

export const prerender = true;

```
- Update build script to `vite build`
```
