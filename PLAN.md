# Turf Minders Roadmap

---

## Phase 1 — Marketing Website ✅ Complete

### Completed
- [x] `index.html` — full single-page site with all sections
- [x] `css/styles.css` — mobile-first, CSS variables, brand colors (#06402A, #8DC63F), Montserrat font
- [x] `js/main.js` — mobile nav, sticky header, scroll animations, form validation, back-to-top
- [x] Hero section with headline, tagline, CTA buttons, trust badges
- [x] Hero background photo (`assets/images/hero-bg.jpg`) — purchased, watermark-free
- [x] Services section — correct tiering: Clean (brush/edge/debris), Refresh (+deodorize), Reset (+sanitize), Infill Refresh add-on
- [x] "Why Turf Cleaning Matters" section — 6 educational cards
- [x] Before/after gallery — 3 real before/after photo pairs in `assets/images/`
- [x] Pricing section — Clean $149 / Refresh $189 / Reset $224 (starting at)
- [x] Contact/quote request form — name, phone, email, street/city/state/zip, preferred contact method, service, message; honeypot spam trap
- [x] Contact form wired to Make.com webhook → Airtable Leads table (tested and confirmed working)
- [x] Real customer testimonials — Lystra L., Christopher F., Susan T. (5-star reviews)
- [x] Footer with service area, navigation links, contact info
- [x] Real logo — white SVG with tight viewBox (from `turf_minders_artwork/`)
- [x] Real phone number: (520) 704-7954
- [x] Real email: info@turfminders.com
- [x] Google Analytics — GA4 property G-JEE0FHK3TM added to `<head>`
- [x] Deployed to Netlify — connected to GitHub, auto-deploys on every push to `main`
- [x] DNS switched — turfminders.com pointed to Netlify, SSL provisioned automatically

### Still Needed / Nice to Have
- [ ] OG social share image (`assets/images/og-image.jpg`, 1200×630px) — uncomment meta tag in `<head>`
- [ ] Favicon PNG (32×32px) — currently using SVG/JPG fallback
- [ ] Test on real mobile devices (iOS Safari, Android Chrome)

### Deployment Workflow
Push changes live: `git add -A` → `git commit -m "message"` → `git push`
Netlify auto-deploys within ~60 seconds of every push to `main`.

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