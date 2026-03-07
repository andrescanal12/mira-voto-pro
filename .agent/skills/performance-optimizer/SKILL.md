---
name: performance-optimizer
description: "Identifies and fixes performance bottlenecks in code, databases, and APIs. Measures before and after to prove improvements."
category: development
risk: safe
source: community
date_added: "2026-03-05"
---

# Performance Optimizer

## The Optimization Process

### 1. Measure First
Never optimize without measuring:
```javascript
console.time('operation');
await slowOperation();
console.timeEnd('operation');
```

### 2. Find the Bottleneck
Use profiling tools (DevTools, `EXPLAIN ANALYZE`).

### 3. Optimize
- **Database:** Adding indexes, fixing N+1 queries.
- **API:** Caching, parallelizing, reducing payloads.
- **Frontend:** Memoization, code splitting, lazy loading.
- **Algorithms:** Improving complexity.

## Measure, Find, Optimize, Verify.
Make it fast, but prove it first.
