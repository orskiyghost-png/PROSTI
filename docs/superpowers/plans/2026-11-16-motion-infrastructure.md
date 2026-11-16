# Motion Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add synchronized Lenis/GSAP scrolling and reversible monochrome transitions between existing routes.

**Architecture:** Add a lifecycle-managed Lenis controller and a shared transition coordinator around the existing React Router shell. Route transitions cover the current page before committing navigation, then reveal the destination; reduced-motion mode navigates immediately. Keep route definitions and page content unchanged.

**Tech Stack:** React 18, TypeScript, React Router 7, GSAP 3 + ScrollTrigger, Lenis, CSS Modules, Vite.

**Spec:** `docs/superpowers/specs/2026-11-16-motion-infrastructure-design.md`

## Global Constraints

- Preserve monochrome tokens, CSS Modules, Vite/React/TypeScript stack, and GitHub Pages base paths.
- Use only `transform`, `opacity`, and `clip-path` for motion, except Lenis's scroll interpolation.
- Honor reduced motion; route changes remain immediate and content remains available.
- Keep mobile touch scrolling native. Do not intercept external links, downloads, modified clicks, or hash navigation.
- No force push or history rewrite. Update `PROGRESS.md`, verify, commit, and push to `main` after stage completion.
- Follow `/home/artemorskiy/PROSTI/AGENTS.md`; retain existing comments and project conventions.

## Review Focus

- React StrictMode remount / teardown: assert one Lenis ticker registration while mounted, and complete cleanup on unmount.
- Reduced-motion preference enabled at startup: assert no Lenis instance or moving route veil; navigation and scroll reset still work.
- External, modified, download, and hash links: assert transition handling leaves browser-native behavior intact.
- Browser Back/Forward and rapid repeated navigation: assert URL and rendered destination agree, transition unlocks, and veil never persists.
- GitHub Pages base path and unknown routes: assert direct route loads retain current behavior and route transitions do not corrupt the basename.

---

### Task 1: Lenis and ScrollTrigger lifecycle

**Files:**
- Create: `src/motion/lenis.ts`
- Modify: `src/components/Shell.tsx`

**Interfaces:**
- Produces: `initLenis(): () => void`, which either initializes smooth scrolling and returns cleanup, or returns a no-op cleanup when touch-only or reduced motion applies.
- Consumes: existing `Shell` lifecycle; GSAP and Lenis dependencies.

- [ ] **Step 1: Implement the controller lifecycle**

In `src/motion/lenis.ts`, register `ScrollTrigger`, detect `prefers-reduced-motion: reduce` and `(pointer: fine)`, create Lenis only when fine pointer applies and reduced motion does not, call `ScrollTrigger.update` on Lenis scroll, and drive Lenis from GSAP ticker using seconds converted to milliseconds. Return idempotent cleanup that removes the ticker callback and scroll listener, destroys Lenis, and unregisters media-query listeners.

- [ ] **Step 2: Attach controller to `Shell` lifecycle**

In `src/components/Shell.tsx`, call `initLenis` from a mount effect and return its cleanup. Retain current route-change scroll reset behavior.

- [ ] **Step 3: Verify controller integration**

Run: `npm run build`
Expected: exit 0; no TypeScript errors or warnings.

Manual check in browser: fine-pointer wheel scrolling is smoothed; touch scrolling remains native; reduced motion disables Lenis; StrictMode leaves no doubled ticker after remount.

- [ ] **Step 4: Commit**

```bash
git add src/motion/lenis.ts src/components/Shell.tsx
git commit -m "feat: synchronize Lenis with ScrollTrigger"
```

### Task 2: Route transition coordinator and veil

**Files:**
- Create: `src/components/RouteTransition.tsx`
- Create: `src/components/RouteTransition.module.css`
- Modify: `src/components/Shell.tsx`
- Modify: `src/App.tsx` only if needed to expose a stable navigation boundary without replacing the existing router.

**Interfaces:**
- Produces: `RouteTransition`, a component that renders the existing route outlet under a fixed veil and coordinates React Router navigation.
- Consumes: current route tree, existing nav links, existing design tokens, `prefers-reduced-motion` preference.

- [ ] **Step 1: Define route-change behavior**

Implement an internal navigation coordinator that distinguishes eligible same-origin React Router links from external links, downloads, modified clicks, and hash-only navigation. During eligible transitions, prevent default, cover the current view with `--void`, commit the destination route, reset scroll to top, then uncover. Keep browser history authoritative for back/forward; guard duplicate transitions while one is running. Skip the veil when reduced motion is enabled.

- [ ] **Step 2: Implement veil component and styles**

Create a fixed, pointer-events-safe monochrome veil in `RouteTransition.tsx` and CSS Module. Animate only `clip-path`; cover and uncover in ~550ms each with existing easing tokens. Use a GSAP context with teardown; kill or finish active timelines safely on unmount or preference change. Keep veil non-focusable and `aria-hidden`.

- [ ] **Step 3: Integrate coordinator without changing route table**

Wrap the existing route outlet in `Shell.tsx` with the coordinator. Preserve `Nav`, footer, skip-link, scroll-to-top behavior, routes, and basename. If links must be intercepted at a shared boundary, ensure click eligibility checks preserve native browser semantics.

- [ ] **Step 4: Verify build and route behavior**

Run: `npm run build`
Expected: exit 0; no TypeScript errors or warnings.

Browser checks: internal forward navigation and Back/Forward settle on the correct URL and page; unknown-route page remains reachable; direct nested route loads work; no persistent overlay remains; focus returns to usable navigation. Confirm external, modified, download, and hash links bypass the veil.

- [ ] **Step 5: Verify reduced motion and responsive widths**

At 375, 390, 768, 1024, and 1440 px, check `document.documentElement.scrollWidth <= window.innerWidth`. Emulate `prefers-reduced-motion: reduce`; confirm navigation is immediate and visible, with no moving veil.

- [ ] **Step 6: Commit**

```bash
git add src/components/RouteTransition.tsx src/components/RouteTransition.module.css src/components/Shell.tsx src/App.tsx
git commit -m "feat: add reversible route transitions"
```

### Task 3: Stage log and final verification

**Files:**
- Modify: `PROGRESS.md`

- [ ] **Step 1: Run final production build**

Run: `npm run build`
Expected: exit 0; generated GitHub Pages fallback files remain present.

- [ ] **Step 2: Verify preview routes and assets**

Run: `npm run preview -- --host 127.0.0.1` and check `/PROSTI/`, `/PROSTI/works/toner`, and `/PROSTI/nope` using browser or HTTP. Expected: homepage, nested route, and SPA not-found behavior load without broken base paths. Confirm browser console has no motion errors.

- [ ] **Step 3: Record stage state**

Update `PROGRESS.md` with completed motion infrastructure, route transition behavior, verification evidence, known limitations, commit IDs, and next step: implement Home page (hero, index, video scroll). Do not mark visual browser checks complete unless actually run.

- [ ] **Step 4: Commit and push**

```bash
git add PROGRESS.md
git commit -m "docs: record motion infrastructure stage"
git push origin main
git status --short --branch
```

Expected: push succeeds and `git status` reports clean `main...origin/main`.
