# Turf Minders Roadmap

---

## Phase 1 — Marketing Website ✅ In Progress

### Completed
- [x] `index.html` — full single-page site with all sections
- [x] `css/styles.css` — mobile-first, CSS variables, brand colors (#06402A, #8DC63F), Montserrat font
- [x] `js/main.js` — mobile nav, sticky header, scroll animations, form validation, back-to-top
- [x] Hero section with headline, tagline, CTA buttons, trust badges
- [x] Hero background photo (`assets/images/hero-bg.jpg`) — purchased, watermark-free
- [x] Services section — correct tiering: Clean (brush/edge/debris), Refresh (+deodorize), Reset (+sanitize), Infill Refresh add-on
- [x] "Why Turf Cleaning Matters" section — 6 educational cards
- [x] Before/After gallery section — placeholders ready for real photos
- [x] Pricing section — Clean $149 / Refresh $189 / Reset $224 (starting at)
- [x] Contact/quote request form — name, phone, email, street/city/state/zip, preferred contact method, service, message; honeypot spam trap; wired to Make.com webhook → Airtable Leads table
- [x] Footer with service area, navigation links, contact info
- [x] Real logo — white SVG with tight viewBox (from `turf_minders_artwork/`)
- [x] Real phone number: (520) 704-7954
- [x] Real email: info@turfminders.com
- [x] Live Server set up for local development preview

### Still Needed — Phase 1
- [ ] Before/after gallery photos (6 images: before-1/2/3.jpg, after-1/2/3.jpg → `assets/images/`) — in progress
- [x] Wire up contact form to submission endpoint — Make.com → Airtable Leads + email notification
- [ ] OG social share image (`assets/images/og-image.jpg`, 1200×630px) — uncomment meta tag in `<head>`
- [ ] Favicon PNG (32×32px) — currently using SVG/JPG fallback
- [ ] Deploy to hosting and point turfminders.com DNS (replace Squarespace)
      → Recommended: Netlify (free, drag-and-drop deploy, connects to domain)
- [ ] Test on real mobile devices (iOS Safari, Android Chrome)
- [x] Google Analytics — GA4 property G-JEE0FHK3TM added to `<head>`

---

## Phase 2 — Customer Portal
- [ ] Customer login / account creation
- [ ] Online quote request with backend storage
- [ ] Stripe payment integration
- [ ] Quote-to-invoice workflow

---

## Phase 3 — Operations
- [ ] Scheduling integration
- [ ] Route management / job calendar
- [ ] Customer service history

---

## Future
- [ ] Automated billing / recurring subscriptions
- [ ] Subscription plan management
- [ ] Turf maintenance reminders (email/SMS)

---

## Phase 2 — Customer Portal
- [ ] Customer login / account creation
- [ ] Online quote request with backend storage
- [ ] Stripe payment integration
- [ ] Quote-to-invoice workflow

---

## Phase 3 — Operations
- [ ] Scheduling integration
- [ ] Route management / job calendar
- [ ] Customer service history

---

## Future
- [ ] Automated billing / recurring subscriptions
- [ ] Subscription plan management
- [ ] Turf maintenance reminders (email/SMS)