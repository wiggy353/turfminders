# Turf Minders — Image Assets

## Current Status

| File | Status | Used in |
|---|---|---|
| `logo.svg` | ✅ Ready | Favicon fallback |
| `logo-white.png` | ✅ Ready | Nav header, Footer |
| `logo-color.png` | ✅ Ready | Available for light-bg use |
| `favicon-icon.jpg` | ✅ Ready | Browser favicon (fallback) |
| `hero-bg.jpg` | ⏳ Needed | Hero section background |
| `before-1/2/3.jpg` | ⏳ Needed | Gallery section |
| `after-1/2/3.jpg` | ⏳ Needed | Gallery section |
| `og-image.jpg` | ⏳ Needed | Social share preview |

---

## Hero Background
- **File:** `hero-bg.jpg` (or `.webp`)
- **Usage:** Main hero section full-bleed background
- **Recommended size:** 1920 × 1080px minimum
- **Format:** WebP preferred for performance, JPEG as fallback
- **Subject:** Beautiful, lush artificial turf — sunny Tucson outdoor setting
- **How to swap:** In `css/styles.css`, find the `.hero` rule and update:
  ```css
  background-image: url('../assets/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  ```

---

## Before / After Gallery Photos

Replace the placeholder `<div>` elements in `index.html` (section `#gallery`) with `<img>` tags:

```html
<!-- BEFORE -->
<img
  src="assets/images/before-1.jpg"
  alt="Matted, debris-covered artificial turf before cleaning"
  loading="lazy"
  class="gallery-img"
/>

<!-- AFTER -->
<img
  src="assets/images/after-1.jpg"
  alt="Clean, groomed artificial turf after Turf Minders service"
  loading="lazy"
  class="gallery-img"
/>
```

Add this CSS rule to `css/styles.css`:
```css
.gallery-img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-lg);
}
```

### Suggested file names:
| File                | Description                               |
|---------------------|-------------------------------------------|
| `before-1.jpg`      | Before: matted/debris-covered turf        |
| `after-1.jpg`       | After: clean groomed turf                 |
| `before-2.jpg`      | Before: pet odor / dog run area           |
| `after-2.jpg`       | After: sanitized dog run area             |
| `before-3.jpg`      | Before: compacted infill, flat blades     |
| `after-3.jpg`       | After: restored pile, even surface        |

- **Recommended size:** 800 × 600px minimum
- **Format:** WebP or JPEG

---

## Logo
- **File:** `logo.svg` (vector preferred) and `logo.png` (fallback)
- **Usage:** Navigation bar and footer
- **How to swap:** In `index.html`, find the `.nav-logo` and replace the text markup:
  ```html
  <img src="assets/images/logo.svg" alt="Turf Minders" width="160" height="48" />
  ```
- **Also update the footer logo** similarly

---

## Favicon
- **File:** `favicon.png` (32×32px) or `favicon.ico`
- **How to add:** Uncomment the `<link rel="icon">` line in the `<head>` of `index.html`

---

## Open Graph / Social Share Image
- **File:** `og-image.jpg`
- **Recommended size:** 1200 × 630px
- **How to add:** Uncomment and update the `<meta property="og:image">` tag in `index.html`
- **Subject:** Turf Minders logo or branded photo of clean turf

---

## Image Optimization Tips
- Use **WebP format** for all photos — roughly 25–35% smaller than JPEG
- Keep hero image under **200KB** for fast load times
- Use `loading="lazy"` on all images below the fold (already added in HTML)
- Consider serving 2x versions for high-DPI screens using `srcset`

---

## Brand Colors (for reference when editing photos)
- Dark Green: `#06402A`
- Light Green: `#8DC63F`
- Font: Montserrat Bold / Semi-Bold
