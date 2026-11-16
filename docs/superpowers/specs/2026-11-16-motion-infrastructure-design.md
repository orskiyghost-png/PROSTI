# Motion infrastructure and route transitions

## Intent

Implement stage 2 from `PROGRESS.md`: establish smooth scrolling, ScrollTrigger integration, and reversible transitions between existing routes. This gives later pages a consistent motion foundation. The Home page remains a separate next stage.

## Goals

- Add Lenis smooth scrolling on suitable pointer devices and synchronize it with GSAP ScrollTrigger.
- Keep native touch scrolling and disable smooth scrolling when `prefers-reduced-motion: reduce` is active.
- Add a monochrome, full-screen route transition consistent with `DESIGN.md` §7.2.
- Support internal navigation, browser back/forward, direct route loads, and unknown routes without trapping the visitor or breaking the URL.
- Reset scroll to the top on route changes, preserving current `Shell.tsx` behavior.
- Clean up Lenis, GSAP ticker callbacks, event listeners, and animation contexts on teardown, including React StrictMode remounts.
- Keep transitions reversible and reveal route content without requiring content-specific animation hooks.

## Non-goals

- Build or restyle Home, add scroll-driven page content, video scrub, parallax, WebGL, or split-text effects.
- Replace existing navigation/menu behavior or add a new visual style.
- Add animation dependencies; GSAP and Lenis are already installed.

## Constraints

- Preserve monochrome tokens, CSS Modules, Vite/React/TypeScript stack, and GitHub Pages base paths.
- Use only `transform`, `opacity`, and `clip-path` for motion, except Lenis's scroll interpolation.
- Honor reduced motion; route changes remain immediate and content remains available.
- Keep mobile touch scrolling native. Do not intercept external links, downloads, modified clicks, or hash navigation.
- No force push or history rewrite. Update `PROGRESS.md`, verify, commit, and push to `main` after stage completion.

## Approaches

1. **Lenis + GSAP ScrollTrigger + GSAP route veil (selected).** Reuse installed dependencies and the transition language already specified in `DESIGN.md`. Supports the desired displacement-free monochrome mask and can cover both forward and history navigation. Requires careful coordination with React Router.
2. **Native scrolling + CSS View Transitions API.** Less code, but browser support and reduced-motion behavior vary; it does not provide the project's specified GSAP/Lenis foundation.
3. **Independent CSS animations on each page.** Simple locally, but duplicates behavior and cannot reliably coordinate route changes or browser history.

Approach 1 is selected because it follows the existing architecture and offers one shared, reversible transition system. Approaches 2 and 3 do not meet the project's cross-route and motion-system requirements as reliably.

## Behavior and visual direction

- Fine-pointer devices use Lenis, with its animation frame driven by GSAP ticker and ScrollTrigger updated from Lenis scroll events. Touch devices keep native scrolling.
- A route change uses a fixed `--void` monochrome veil: cover the current page from bottom to top, commit the route change, then uncover from bottom to top. The full transition should take about 1.1 seconds, aligned with the existing 550 ms per phase.
- Browser back/forward uses the same veil in the reverse direction where practical; URL and route content must always settle on the browser-selected destination.
- Route changes reset scroll to top, matching current `Shell.tsx` behavior. Reduced-motion mode skips the veil and Lenis, while preserving immediate navigation and scroll reset.
- Navigation controls remain usable after transitions. Focus must not remain inside hidden or covered content.

## Acceptance checks

- `npm run build` passes without TypeScript errors or warnings.
- ScrollTrigger updates during Lenis scrolling; teardown leaves no duplicate ticker callbacks or listeners.
- Mouse-wheel/trackpad scrolling is smooth on fine-pointer devices; touch scrolling remains native.
- Internal links, back/forward, direct loads, unknown routes, and GitHub Pages basename work.
- Forward and backward route transitions finish on the correct route and never leave a persistent veil.
- Reduced-motion disables Lenis and transition movement without hiding content or blocking navigation.
- Route changes reset scroll to top. No horizontal overflow appears at 375, 390, 768, 1024, and 1440 px.

## Open to implementation

- Choose the smallest React Router-compatible transition coordinator that can delay route commit until the veil covers the current page, without changing the current router architecture.
- Use existing tokens and CSS Modules. Add only the motion files and components needed for this stage.
- If browser-history transitions cannot safely animate both directions, prioritize correct route and URL behavior, then document the limitation in `PROGRESS.md`.
