# YourOrchard — Project Context

## What this is
Tree rental platform where city customers rent trees on a farm in Ramnagar, Uttarakhand. Customers get weekly photo/video updates from orchardists and receive their harvest delivered to their door.

## Stack
- **Frontend**: React 19 + TypeScript + Vite (port 3000) — `frontend/`
- **Backend**: Express + TypeScript (port 5000) — `backend/`
- **DB**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **File uploads**: multer (images/videos up to 200MB) → `backend/uploads/`

## Key rules
- `verbatimModuleSyntax: true` → always use `import type` for interfaces
- Never read `.env` files

## Brand
- Name: **YourOrchard**
- Font: Outfit (Google Fonts)
- Colors: `--bg: #eaece6`, `--green: #2d6a4f`, `--green-dark: #162c1d`, `--dark: #0e2015`, `--gray: #5d6b62`
- Hero tagline color: `#D97706` (mango amber)

## Current UI state (MangoBox-inspired design)

### Sections in order (home view)
1. **Nav** — white sticky, uppercase links, YourOrchard logo
2. **Hero** — split layout: left text + right mango photo (Unsplash). Has label pill, animated tagline, `hero-heading` (5.5rem 900wt), trust items, stats strip below
3. **Stats strip** — green band: 120+ Trees / 3 Seasons / 450+ kg / 98% Happy Owners
4. **How It Works** — 4 steps with `step-label` (STEP 01 style), `step-icon-wrap`, arrow connectors
5. **Features** — 6-card grid (`fc1`–`fc6`), each with colored gradient top, icon, title, desc, tag pill
6. **Gallery** — dark green section, 4-col bento grid (6 Unsplash photos), staggered spans
7. **Plans** — 3 plan cards (sapling/adult/grand) with real mango photo headers + gradient overlay
8. **All Trees** — individual tree cards with colored banner strip per tier
9. **Videos** — uploaded orchard videos
10. **Reviews** — review form + review cards
11. **CTA** — dark bg with mango photo overlay
12. **Footer** — 3-col dark green grid (brand+social | explore | contact+CTA)

### CSS class naming conventions
- Plan tiers: `plan-sapling`, `plan-adult`, `plan-grand`
- Tree tiers: `tree-tier-sapling`, `tree-tier-adult`, `tree-tier-grand`
- Feature card variants: `fc1` through `fc6`
- Gallery items: `gi-1` through `gi-6` (with explicit grid-column/row placement)
- Section label pill: `.section-label`

### Images used (Unsplash)
- Hero: `photo-1601493700631-2b16ec4b4716` (yellow mangoes)
- Plan sapling: `photo-1553279768-865429fa0078`
- Plan adult: `photo-1500651230702-0e2d8a49d4ad`
- Plan grand: `photo-1416879595882-3373a0480b5b`
- Gallery 1 (wide): `photo-1553279768-865429fa0078`
- Gallery 2: `photo-1601493700631-2b16ec4b4716`
- Gallery 3: `photo-1518495973542-4542c06a5843`
- Gallery 4 (wide): `photo-1500651230702-0e2d8a49d4ad`
- Gallery 5: `photo-1416879595882-3373a0480b5b`
- Gallery 6: `photo-1488459716781-31db52582fe9`
- CTA bg: `photo-1553279768-865429fa0078`

## API routes
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET/POST /api/trees`
- `GET/POST /api/rentals`, `GET /api/rentals/my`, `PATCH /api/rentals/:id/cancel`
- `GET/POST /api/reviews`
- `GET/POST /api/farm-updates/:rentalId`
- `GET/POST /api/videos`

## Views
`home` | `login` | `register` | `dashboard` | `about` | `contact` | `blog`

## Pending / ideas
- MongoDB Atlas migration (currently local) — user needs to create cluster, update .env MONGO_URI
- Real orchard photos from Ramnagar (replace Unsplash placeholders)
- Payment integration
- Email notifications for weekly updates
