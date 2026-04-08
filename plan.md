# CPP Kitchen & Bath Landing Page
## Technical Plan & Reference Document

---

## Project Overview

**URL:** `cppkitchenbath.com/cape-cod-home` (or `/a-moment-to-shine`)

**Purpose:**
1. Build trust (magazine feature, project story, photos, homeowner perspective)
2. Drive action (consultation booking, calls, inquiries)
3. Track everything (GA4, Meta Pixel, call tracking)

**Style:** Elegant, editorial, easy to scan. "Luxury project story" not "advertisement."

---

## Research Summary

### Key Findings from Landing Page Best Practices

**The 5-Second Test** (Framer, 2025)
- Visitors must understand the value proposition within 5 seconds
- Hero must show: compelling headline, benefit-driven copy, social proof, and low-friction CTA
- David Ogilvy: "Five times as many people read the headline as read the body copy"

**Story-Driven Copy**
- Lead with the homeowner's pain point, not features
- Use frameworks like PAS (Problem, Agitate, Solution)

**Remove Distractions**
- No navigation menu (or minimal)
- No external links in body
- Single conversion goal

**Reduce Friction**
- Microcopy near CTAs: "No obligation," "Free consultation," "Takes 2 minutes"
- Clear next steps

**Show, Don't Tell**
- Real project photos (never stock)
- Before/after comparisons

**Performance Impact**
- Sites with smart scroll animations: 37% boost in engagement
- 23% longer session durations
- Well-implemented animations: 20% lower bounce rates

---

### High-End Remodeling Website Patterns

| Pattern | Implementation |
|---------|----------------|
| Typography | Serif for headlines (elegant), sans-serif for body (readable) |
| Colors | Warm neutrals, lots of white space, dark accents |
| Layout | Full-width hero images, generous padding, clear hierarchy |
| Photos | Professional, consistent lighting, real projects only |
| Testimonials | Named clients, specific results |
| CTAs | High contrast, square/minimal corners, action-oriented text |

---

### Before/After Slider Implementation

**Approach:** Custom vanilla JS slider using Intersection Observer
- Lightweight (~1KB)
- No dependencies
- Touch-friendly for mobile
- Draggable divider with circle handle

---

### Scroll Animation Approach

**Use Intersection Observer API** (not scroll events)
- Only fires when elements enter viewport
- Near-zero performance cost
- Native browser support

**Animate only these properties:**
- `opacity` (fade in)
- `transform` (slide up/in)
- Never animate `width`, `height`, `margin` (causes reflow)

**Accessibility:**
- Respect `prefers-reduced-motion` media query

**Implementation pattern:**
```css
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## Technical Architecture

### Tech Stack

```
HTML5        Semantic structure, accessibility
CSS3         Custom properties, Grid/Flexbox, animations
Vanilla JS   Intersection Observer, slider, tracking
```

### File Structure

```
/cpp-landing-page/
  index.html          Main page
  plan.md             This file
  css/
    style.css         All styles
  js/
    main.js           Scroll animations, slider, tracking
  images/
    (placeholders)    Will be replaced with real photos
```

---

## Design Specifications

### Color Palette (from theartisticelements.com)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-primary` | `#B39C8B` | Warm taupe accents, borders |
| `--color-secondary` | `#B39D93` | Subtle backgrounds |
| `--color-accent` | `#3F3E3E` | Buttons, headlines |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-bg-alt` | `#F8F6F4` | Section backgrounds |
| `--color-text` | `#222222` | Body copy |
| `--color-cream` | `#ECD9C7` | Soft highlights |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headlines | Georgia, serif | 400 | 48-60px |
| Subheads | Helvetica Neue, sans-serif | 500 | 24-32px |
| Body | Helvetica, Arial, sans-serif | 400 | 17-18px |
| Buttons | Helvetica Neue, sans-serif | 600 | 14px uppercase |

### Spacing System

| Token | Value | Use |
|-------|-------|-----|
| `--space-xs` | 8px | Tight gaps |
| `--space-sm` | 16px | Element spacing |
| `--space-md` | 32px | Section padding |
| `--space-lg` | 64px | Between sections |
| `--space-xl` | 120px | Hero breathing room |

### Components

**Buttons:**
- Primary: Dark charcoal (#3F3E3E) background, white text, square corners
- Secondary: White background, dark text, taupe border
- Hover: Subtle lift (transform) + slight darken

**Cards:**
- White background
- Subtle shadow: `0 4px 20px rgba(0,0,0,0.08)`
- No border radius (square, elegant)

---

## Page Sections

### 1. Hero Section
- Full viewport height, centered content
- Badge: "Featured in Cape Cod HOME"
- Headline: "A Moment to Shine"
- Subhead: transformation description
- Three buttons: Read Story, View Before/After, Book Consultation
- Animation: Fade in + slide up on load (staggered)

### 2. Magazine Feature Section
- Two columns: image left, text right
- Magazine cover and spread images
- Short intro text
- Animation: Fade in on scroll

### 3. The Homeowner Story
- Single column, editorial feel
- Four paragraphs: Challenge, What Mattered, Process, Result
- Pull quote with homeowner name
- Animation: Each paragraph fades in

### 4. Before & After Gallery
- Interactive comparison slider
- Grid of detail shots below
- Lightbox on click
- Animation: Staggered fade in

### 5. Why Homeowners Choose CPP
- 3-5 cards in a row
- Icons + short descriptions
- Animation: Cards stagger in from bottom

### 6. Call to Action
- Full-width warm background
- Headline + subhead
- Primary button + phone number
- Social links
- Link to main site

### 7. Footer
- Minimal, single line
- Company name, location, phone

---

## GA4 Event Tracking

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `page_view` | Page load | `page_location`, `page_title` |
| `scroll` | 25%, 50%, 75%, 90% depth | `percent_scrolled` |
| `cta_click` | Any button click | `button_text`, `button_location` |
| `form_start` | First form field focus | `form_name` |
| `form_submit` | Form submission | `form_name` |
| `click_to_call` | Phone link clicked | `phone_number` |
| `outbound_link` | External link clicked | `link_url` |

**UTM for QR Code:**
```
?utm_source=magazine&utm_medium=print&utm_campaign=cape_cod_home_2025
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total Page Weight | < 500KB (excluding images) |
| JavaScript | < 10KB |
| CSS | < 15KB |

---

## Accessibility Checklist

- [ ] All images have descriptive alt text
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] `prefers-reduced-motion` respected
- [ ] Form labels properly associated
- [ ] Semantic HTML used

---

## Content Placeholders

Until real content is provided:
- Hero image: Solid color placeholder
- Magazine images: Gray placeholders with text
- Before/after: Placeholder rectangles
- Homeowner story: Fake but realistic copy
- Contact info: Placeholder phone/email

---

## Reference Links

- Intersection Observer: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- CSS Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- GA4 Event Tracking: https://developers.google.com/analytics/devguides/collection/ga4/events
