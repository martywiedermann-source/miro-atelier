# Miroslav Wiedermann — Artist Portfolio

A luxury personal brand website for visual artist and speaker Miroslav Wiedermann.

## Tech Stack

- **React** + **TypeScript** — UI framework
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **Framer Motion** — Cinematic animations and page transitions
- **React Router v6** — Multi-page navigation
- **shadcn/ui** — UI component primitives
- **Embla Carousel** — Hero slider and gallery carousels
- **Lucide React** — Icon library

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  components/
    Navbar.tsx              — Fixed top navigation with logo and frosted glass
    Footer.tsx              — 4-column footer with newsletter signup
    Slider.tsx              — Reusable Embla-based slider (crossfade + autoplay)
    Hero.tsx                — Full-screen hero slideshow
    ArtworkCard.tsx         — Gallery artwork card with hover overlay
    Lightbox.tsx            — Artwork detail modal with prev/next navigation
    Timeline.tsx            — Vertical center-line milestone timeline
    EventCard.tsx           — Exhibition/event card (full + compact modes)
    ContactForm.tsx         — Smart inquiry form with type selector
    InquiryTypeSelector.tsx — Button-group for inquiry types
    SectionLabel.tsx        — Reusable "01 — LABEL" section heading
    LogoPartnerRow.tsx      — Partner/gallery logo row (grayscale → color)
    PageTransition.tsx      — Framer Motion page transition wrapper
  pages/
    Home.tsx                — Homepage with hero, philosophy, gallery teaser, events, CTA
    Gallery.tsx             — Masonry grid gallery with filtering and lightbox
    About.tsx               — Bio, timeline, quote, press kit, partner logos
    Events.tsx              — Upcoming + past exhibitions
    Contact.tsx             — Two-column contact page with smart form
  lib/
    artworks.ts             — 12 placeholder artwork data objects
    events.ts               — 8 placeholder event data objects
    utils.ts                — Utility functions
public/
  logo/
    logo.svg                — MW monogram logo (replace with your actual logo)
    logo-grey.svg           — Greyscale version for footer
  images/
    slider/                 — Hero slider images (slide-1.jpg to slide-5.jpg)
    gallery/                — Gallery images (artwork-1.jpg to artwork-12.jpg)
    portrait.jpg            — Artist portrait placeholder
    about-banner.jpg        — About page banner
  press-kit.pdf             — Press kit download placeholder
```

## How to Replace Content

### Images
All image paths are clearly commented with `// REPLACE` markers:
- **Logo:** Replace `/public/logo/logo.svg` with your SVG logo (max 200×60px)
- **Slider:** Replace images in `/public/images/slider/`
- **Gallery:** Replace images in `/public/images/gallery/`
- **Portrait:** Replace `/public/images/portrait.jpg`
- **About banner:** Replace `/public/images/about-banner.jpg`

### Text Content
All placeholder text is wrapped in `{/* PLACEHOLDER */}` comments. Search for "PLACEHOLDER" to find all replaceable content.

### Artwork Data
Edit `src/lib/artworks.ts` to update titles, descriptions, dimensions, etc.

### Event Data
Edit `src/lib/events.ts` to update exhibitions, speaking events, etc.

## Design System

### Colors (Light Luxury)
- Background: `#FAFAF8` (warm off-white)
- Surface warm: `#F2F0EB` (cream)
- Text primary: `#0D0D0D` (near-black)
- Accent gold: `#C9A84C`
- Dark contrast: `#0D0D0D` (CTA banner only)

### Typography
- **Cormorant Garamond** — Headings, quotes, display text
- **Outfit** — Body text, navigation, buttons
- **Space Mono** — Labels, dates, technical details

## Deployment

### Vercel
```bash
npm run build
# Deploy the `dist/` folder to Vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Contact Form

The contact form currently uses a `mailto:` fallback. To connect a real email service:
1. Copy `.env.example` to `.env`
2. Add your Resend API key
3. Update `ContactForm.tsx` to call the API

## License

All rights reserved © 2025 Miroslav Wiedermann
