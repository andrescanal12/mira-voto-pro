---
name: react-best-practices
description: "React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns."
risk: unknown
source: community
date_added: "2026-02-27"
---

# Vercel React Best Practices

## Rule Categories by Priority

1. **Eliminating Waterfalls (CRITICAL)**: Use `Promise.all()`, move awaits into branches, use Suspense.
2. **Bundle Size Optimization (CRITICAL)**: Avoid barrel files, use `next/dynamic`, load conditional modules.
3. **Server-Side Performance (HIGH)**: `React.cache()` for deduplication, minimize data passed to client.
4. **Re-render Optimization (MEDIUM)**: Memoization, functional setState, stable callbacks.
5. **Rendering Performance (MEDIUM)**: `content-visibility` for long lists, hoist JSX.
6. **JavaScript Performance (LOW-MEDIUM)**: Build Maps for repeated lookups, group CSS changes.

## Quick Reference

- `async-parallel`: Use `Promise.all()` for independent operations.
- `bundle-barrel-imports`: Import directly, avoid barrel files.
- `rerender-memo`: Extract expensive work into memoized components.
- `rendering-content-visibility`: Use `content-visibility` for long lists.
- `js-index-maps`: Build Map for repeated lookups.
