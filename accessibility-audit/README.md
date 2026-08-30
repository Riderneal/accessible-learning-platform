# Accessibility Audit

## Method

Ran [axe-core](https://github.com/dequelabs/axe-core) (the accessibility
testing engine underlying most of Lighthouse's a11y checks) against the
actual production build output (`next build` + `next start`) for all 4
routes: `/`, `/profile`, `/upload`, `/results`. `color-contrast` was
excluded since it requires a real rendering engine's computed styles,
which a headless DOM (no browser) can't provide — everything else (ARIA,
semantic structure, labels, landmarks, alt text, heading hierarchy) ran
against the real rendered HTML.

Reproduce with:
```bash
npm install --no-save jsdom axe-core
npm run build && npm run start &
node audit-a11y.js
```

## Findings and fixes

Initial audit found 2 real violations, both on `/profile`:

| Rule | Impact | Issue | Fix |
|---|---|---|---|
| `button-name` | Critical | The 4 need-selection checkboxes (Radix UI, rendered as `<button role="checkbox">`) had no accessible name — a screen reader user couldn't tell what each checkbox was for | Added `aria-label` matching each option's visible label (`components/ui/checkbox` usage in `app/profile/page.tsx`) |
| `heading-order` | Moderate | Page went `<h1>` → `<h3>`, skipping `<h2>`, for the "Your name" card title | Added an `as` prop to the shared `CardTitle` component (defaults to `h3`, unchanged everywhere else) and used `as="h2"` for this instance |

## Result

| | Before | After |
|---|---|---|
| Violations (4 routes) | 2 | **0** |
| Passed checks (4 routes) | 81 | **83** |

Both fixes are minimal and scoped — the `CardTitle` change is backward
compatible (opt-in prop, existing usages unaffected).
