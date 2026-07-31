# Web quality baseline

Equiply targets WCAG 2.2 AA for the public landing page and application shell.

## Implemented

- Semantic landmarks, ordered heading hierarchy, and one page-level heading.
- Keyboard skip link and visible focus indicators.
- Native dialog behavior for mobile navigation, including Escape and focus containment.
- Programmatic labels for icon controls, search, progress, and inventory visualization.
- Minimum 24 by 24 pixel targets and reduced-motion support.
- Public landing page separated from the non-indexable `/dashboard` route.
- Canonical metadata, Open Graph metadata and image, JSON-LD, sitemap, robots rules, and web manifest.
- Security and privacy response headers in the Next.js configuration.
- Automated axe checks for the landing page and dashboard shell.

## Manual release checks

- Navigate the complete interface using Tab, Shift+Tab, Enter, Space, and Escape.
- Test at 200% browser zoom and at 320 CSS pixels wide.
- Verify the mobile dialog and focus return with NVDA or VoiceOver.
- Check contrast and forced-colors mode after every palette change.
- Run Lighthouse against the deployed URL for accessibility, SEO, and performance.
- Validate JSON-LD with Schema.org Validator and confirm canonical URLs use the production domain.

Automated checks do not replace assistive-technology and contrast testing.
