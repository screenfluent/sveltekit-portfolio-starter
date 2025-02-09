# SvelteKit Migration Technical Plan

## 1. Project Structure Mapping

```diff
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

Note: Blog posts will be stored in src/content/blog/ and loaded via +page.server.ts in the blog routes.
This provides better separation of content and routing logic while maintaining all Next.js functionality.
```

## 2. Core Dependencies

```markdown
- Remove Next.js dependencies:

  - next
  - react-dom
  - @types/react

- Add SvelteKit dependencies:
  - @sveltejs/kit
  - svelte
  - @sveltejs/adapter-static
  - svelte-preprocess
```

## 3. Routing Migration Strategy

### Page Routes

```svelte
<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
	export let data;
	// SvelteKit page data from load function
</script>
```

### Dynamic Routes

```diff
app/blog/[slug]/page.tsx → src/routes/blog/[slug]/+page.svelte
```

## 4. Data Fetching Conversion

| Next.js Pattern    | SvelteKit Equivalent |
| ------------------ | -------------------- |
| getStaticProps     | +page.server.js load |
| getServerSideProps | +page.server.js load |
| API Routes         | +server.js endpoints |

## 5. Component Migration Checklist

- [ ] Convert React components to Svelte syntax
- [ ] Replace useState → $state runes
- [ ] Migrate useEffect → $effect
- [ ] Convert props handling → $props

## 6. Styling Strategy

```javascript
// svelte.config.js
export default {
	preprocess: preprocess({
		postcss: true // Enable Tailwind
	})
};
```

## 7. API Routes Conversion

```javascript
// src/routes/api/projects/+server.ts
export const GET = async () => {
	return json(await getProjects());
};
```

## 8. Configuration Changes

| File                 | Changes Needed                |
| -------------------- | ----------------------------- |
| package.json         | Update scripts & dependencies |
| tsconfig.json        | SvelteKit base config         |
| svelte.config.js     | New adapter setup             |
| .npmrc → bunfig.toml | Completed in previous step    |

## 9. Testing Strategy

1. Component-level tests with Vitest
2. E2E navigation tests via Playwright
3. Data loading validation
4. Static generation verification

## 10. Deployment Plan

```markdown
- Use adapter-static for SSG
- Configure prerender in +page.ts:
```

export const prerender = true;

```
- Update build script to `vite build`
```

## Timeline Estimate

| Phase              | Estimate |
| ------------------ | -------- |
| Core Setup         | 2 hours  |
| Page Migration     | 6 hours  |
| API Conversion     | 3 hours  |
| Styling Adjustment | 4 hours  |
| Testing & Polish   | 5 hours  |

Would you like me to proceed with implementing any specific section first?
