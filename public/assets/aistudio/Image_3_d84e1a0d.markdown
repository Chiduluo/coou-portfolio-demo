---
name: Obsidian Kinetic
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#ffb596'
  on-tertiary: '#581e00'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-tag:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system defines the visual language for a high-caliber software engineering and computer science portfolio. The design aesthetic synthesizes modern technical minimalism with subtle glassmorphic depth, conveying rigorous architectural discipline, academic excellence, and cutting-edge technical proficiency.

The emotional objective is to evoke confidence, precision, and deep technical focus. The interface establishes an immersive, distraction-free environment that prioritizes scannable project artifacts, clean source code representations, metrics, and academic milestones. Tactile responsiveness is delivered through deliberate micro-interactions, subtle borders, and precise luminous accents.

## Colors
The palette is rooted in an ultra-deep navy foundation paired with electric blue energy and crisp cyan terminal-inspired accents:

- **Canvas & Backgrounds:** Base background is `#0F172A` (deep navy slate). Layered cards, toolbars, and containers build upward using `#1E293B` (slate-800) and elevated overlays of `#334155` (slate-700) to ensure high-contrast separation.
- **Primary Energy:** `#2563EB` (electric blue) serves as the driving interactive anchor—governing primary CTAs, active indicators, and focus outlines.
- **Secondary / Highlight:** `#38BDF8` (luminous cyan) delivers high-impact accents: syntax tokens, featured tags, inline code snippets, and kinetic hover glows.
- **Typography:** `#F8FAFC` (slate-50) is used for headlines, dominant labels, and interactive triggers, providing maximum WCAG AAA contrast against the dark base. `#94A3B8` (slate-400) anchors secondary body copy, metadata, and code annotations. Border delineation relies on `#1E293B` at 80% opacity (`rgba(30, 41, 59, 0.8)`).

## Typography
The system utilizes Inter across all content tiers for its balanced geometric legibility, neutral stance, and precision at high screen densities. For specialized technical representations (code blocks, git hashes, terminal prompts, tech stack tags), JetBrains Mono is paired seamlessly to accentuate the developer persona.

Tight negative letter tracking on display and headline levels produces an authoritative, modern software editorial presence. Body typography prioritizes tall line-heights for extended readability across technical case studies.

## Layout & Spacing
The layout adheres to a 12-column responsive fluid grid pinned within a maximum content container width of 1280px.

- **Breakpoints:** Mobile (under 768px), Tablet (768px–1024px), Desktop (above 1024px).
- **Responsive Adaptations:** Desktop project showcases display in 2-column or 3-column matrices; these collapse into single-column vertical stacks on mobile viewports. Margins adjust from `1.25rem` on mobile to `2rem` on desktop, expanding to `4rem` for hero and project section dividers.
- **Rhythm:** Layout whitespace is based on an 8pt step system to guarantee consistent rhythm between typography, iconography, and card surfaces.

## Elevation & Depth
Depth relies on ambient low-opacity illumination and structural hairline boundaries rather than heavy drop shadows:

- **Surface Levels:** 
  - *Base:* `#0F172A`
  - *Surface-1 (Cards & Modules):* `#1E293B` at 70% opacity with `16px` backdrop blur (`backdrop-blur-md`).
  - *Surface-2 (Dropdowns & Modals):* `#334155` at 85% opacity with `24px` backdrop blur.
- **Borders & Outlines:** Low-contrast hairline outlines (`1px solid rgba(30, 41, 59, 0.8)`) encase surfaces. On hover, borders transition smoothly to `rgba(56, 189, 248, 0.4)`.
- **Restrained Shadows:** Interactive elevations utilize deep, diffused shadows with blue ambient undertones: `0 10px 30px -10px rgba(15, 23, 42, 0.8), 0 0 20px -5px rgba(37, 99, 235, 0.15)`.

## Shapes
The design adopts structured, rounded geometries. Primary cards, code display blocks, and interactive modals utilize `rounded-2xl` (1rem / 16px to 1.5rem / 24px) for approachable yet engineered contours. Interactive inner elements such as buttons, form fields, and chip badges implement `rounded-xl` (0.75rem / 12px) to maintain a cohesive hierarchy of radius nesting.

## Components

- **Buttons:**
  - *Primary Button:* Solid `#2563EB` background, `#F8FAFC` text, `rounded-xl`, padding `0.75rem 1.5rem`. Subtle glow shadow on hover (`box-shadow: 0 0 20px rgba(37, 99, 235, 0.4)`), scale transform of `1.02`, and transition duration of `200ms ease`.
  - *Secondary / Ghost Button:* Transparent slate background with `1px solid rgba(148, 163, 184, 0.2)` border, `#F8FAFC` text. Hover transitions border to `#38BDF8` with `#38BDF8/10` background tint.

- **Cards (Projects, Experience, Education):**
  - Built with `rounded-2xl`, background `rgba(30, 41, 59, 0.6)`, and `1px solid rgba(30, 41, 59, 0.8)`. Content padding is `1.5rem` on mobile, scaling to `2rem` on desktop. Hover states activate an inner gradient flare and a subtle accent highlight on the card's top edge.

- **Tech Stack Chips & Badges:**
  - `rounded-lg` pill modules using JetBrains Mono (`label-code`), `rgba(15, 23, 42, 0.8)` background, `#94A3B8` text, and `border border-slate-800`. Selected or active tags feature `#38BDF8` text and `rgba(56, 189, 248, 0.2)` border.

- **Terminal & Code Blocks:**
  - Embedded preview panels with an explicit header bar featuring simulated window controls (red/yellow/green dots), file path label, and copy-to-clipboard action. Surface `#0B1120`, font JetBrains Mono, `#F8FAFC` base code text with cyan and blue syntax highlights.

- **Form Fields & Inputs:**
  - Elevated background `rgba(15, 23, 42, 0.6)`, `rounded-xl`, border `1px solid rgba(51, 65, 85, 0.8)`, placeholder text `#64748B`. Focus transitions border to `#2563EB` with an ambient `0 0 0 3px rgba(37, 99, 235, 0.25)` outer ring.