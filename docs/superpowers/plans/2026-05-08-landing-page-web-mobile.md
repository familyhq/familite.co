# Landing Page — Web + Mobile Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `familite.co` marketing site so the landing page showcases both the web dashboard and the iOS/Android app side-by-side, adds a Bills feature section, rewrites the Planning section to match the shipped product, surfaces App Store + Play Store badges, and applies targeted privacy/terms/about additions for new features.

**Architecture:** Pure static HTML site. No build step. No JS framework. Tailwind via CDN (`@tailwindcss/browser@4`) + a small `assets/brand.css`. Each section pairs an existing web screenshot with a phone-shaped CSS frame containing a mobile screenshot PNG (user-provided). Badges are inline-SVG + CSS components that look like Apple/Google badges; URLs all point to `https://app.familite.co` until store listings exist. No image compositing — composition is HTML/CSS only.

**Tech Stack:** HTML5 + Tailwind CSS 4 (CDN) + custom `brand.css`. No build process. Git for commits.

---

## Pre-flight

**Spec reference:** `docs/superpowers/specs/2026-05-08-landing-page-web-mobile-design.md`

**Mobile screenshots (user-provided):** before any task that references them, ensure these files exist in `familite.co/assets/`:
- `mobile_hero.png` — Money home (most recognizable)
- `mobile_money.png` — Money home or Pulse
- `mobile_bills.png` — Bills inbox / list
- `mobile_planning.png` — Planning timeline
- `mobile_vault.png` — Vault home

Each ~1080–1290 px wide, 9:19.5 aspect, PNG. If a screenshot is not yet ready, the page will show a broken-image icon for that one section — keep moving and the user will drop it in.

**No tests, no build step.** Verification per task = open the file in a browser, visually confirm the change, commit. Run a tiny local server (e.g. `python3 -m http.server 8765` from `familite.co/`) and visit `http://localhost:8765/` while iterating, so the dark-mode CSS, font CDN, and Tailwind CDN all behave normally.

**Commit cadence:** one commit per task. Keep `index.html` edits scoped per section so commits are reviewable.

---

## File map

| File                                       | What changes                                                                                                            |
|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `assets/brand.css`                         | + `.brand-phone-frame`, `.brand-app-badge`, `.brand-play-badge` helpers                                                 |
| `index.html`                               | Nav (rename, add Bills); hero (web+phone+badges); comparison-band copy; Money copy + phone; **NEW Bills section**; Planning rewrite + phone; Vault phone; bottom CTA badges |
| `privacy.html`                             | + Bill Uploads & AI Parsing block; + Email Forwarding for Bills block; + Todos retention bullet; + Planning clarification sentence |
| `terms.html`                               | + Bill parsing disclaimer; + "Familite does not pay bills" paragraph; + Email forwarding sentence                        |
| `about.html`                               | + Cross-platform sentence (Web/iOS/iPadOS/Android); optional one-word Organizer card edit                                |
| `assets/mobile_*.png`                      | New (user-provided, listed above)                                                                                       |

---

### Task 1: Add CSS helpers for phone frame and app badges

Add reusable styles for the phone-shaped frame and the App Store / Play Store badge components.

**Files:**
- Modify: `assets/brand.css` — append at end of file

**Steps:**

- [ ] **Step 1: Open `assets/brand.css` in editor**

- [ ] **Step 2: Append phone frame and badge CSS at end of file**

Append this block to `assets/brand.css` (after the last `.shadow-brand-teal-light\/30` rule):

```css
/* === Phone frame for mobile screenshots === */
.brand-phone-frame {
  position: relative;
  display: inline-block;
  aspect-ratio: 9 / 19.5;
  border-radius: 2.25rem;
  background-color: var(--brand-gray-900);
  padding: 0.5rem;
  box-shadow:
    0 25px 50px -12px rgb(0 0 0 / 0.35),
    0 0 0 1px rgb(255 255 255 / 0.04) inset;
}

.brand-phone-frame > img,
.brand-phone-frame > .brand-phone-screen {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 1.75rem;
  object-fit: cover;
  background-color: var(--brand-gray-800);
}

/* Empty placeholder (when a real screenshot isn't dropped in yet) */
.brand-phone-screen--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-gray-400);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(180deg, var(--brand-gray-800), var(--brand-gray-700));
}

/* === App Store / Play Store badges === */
.brand-app-badge,
.brand-play-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.9rem;
  background-color: #000;
  color: #fff;
  border-radius: 0.625rem;
  border: 1px solid rgb(255 255 255 / 0.18);
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  line-height: 1;
}

.brand-app-badge:hover,
.brand-play-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px -8px rgb(0 0 0 / 0.4);
}

.brand-app-badge svg,
.brand-play-badge svg {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.brand-app-badge .brand-badge-line-1,
.brand-play-badge .brand-badge-line-1 {
  display: block;
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 0.1rem;
}

.brand-app-badge .brand-badge-line-2,
.brand-play-badge .brand-badge-line-2 {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}
```

- [ ] **Step 3: Visual smoke test**

Open `index.html` in browser. Page should still render exactly as before — no visual change yet. CSS additions are dormant until used by markup in later tasks.

- [ ] **Step 4: Commit**

```bash
cd /Users/imantumorang/familite/familite.co
git add assets/brand.css
git commit -m "Add phone-frame and app/play-store badge styles to brand.css"
```

---

### Task 2: Update nav — rename Finance → Money, add Bills link

**Files:**
- Modify: `index.html:80-94` (the three `<a>` nav links inside the desktop nav row)

**Steps:**

- [ ] **Step 1: Locate the existing nav link block**

In `index.html`, lines ~80–94 currently contain:

```html
<a
  href="#finance"
  class="hidden sm:block text-sm font-medium brand-nav-link transition"
  >Finance</a
>
<a
  href="#planning"
  class="hidden sm:block text-sm font-medium brand-nav-link transition"
  >Planning</a
>
<a
  href="#vault"
  class="hidden sm:block text-sm font-medium brand-nav-link transition"
  >Vault</a
>
```

- [ ] **Step 2: Replace with the four-link version (Money, Bills, Planning, Vault)**

Replace the three `<a>` blocks above with this exact block:

```html
<a
  href="#money"
  class="hidden sm:block text-sm font-medium brand-nav-link transition"
  >Money</a
>
<a
  href="#bills"
  class="hidden sm:block text-sm font-medium brand-nav-link transition"
  >Bills</a
>
<a
  href="#planning"
  class="hidden sm:block text-sm font-medium brand-nav-link transition"
  >Planning</a
>
<a
  href="#vault"
  class="hidden sm:block text-sm font-medium brand-nav-link transition"
  >Vault</a
>
```

- [ ] **Step 3: Visual smoke test**

Open `index.html`. Verify nav now shows: `Money · Bills · Planning · Vault · [Join Beta]`. The `Money` and `Bills` links currently scroll nowhere (no targets yet) — that's expected; targets land in later tasks.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Rename Finance to Money and add Bills link in landing nav"
```

---

### Task 3: Update hero — add phone composition, badges, and surface microcopy

The hero currently has the web dashboard PNG centered below the headline + CTA. Replace the single-screenshot block with a web+phone composition, and add App/Play badges + a `Web · iPadOS also available` line under the CTA.

**Files:**
- Modify: `index.html:104-150` (the entire `<header>` element)

**Steps:**

- [ ] **Step 1: Locate the hero `<header>` element**

`index.html` line ~104 starts with `<header class="relative pt-12 pb-14 ...`. The hero ends at the `</header>` closing tag near line 150.

- [ ] **Step 2: Replace the entire hero `<header>` block**

Replace the existing `<header>` (from `<header class="relative pt-12 ...` through its closing `</header>`) with this exact block:

```html
<header class="relative pt-12 pb-14 sm:pt-16 sm:pb-20 lg:pt-28 lg:pb-36 overflow-hidden">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="brand-badge brand-badge-primary mb-4 sm:mb-6">
      Early-Access Beta for Modern Families
    </div>
    <h1 class="text-2xl sm:text-4xl lg:text-6xl text-gray-900 tracking-tight mb-4 sm:mb-6 leading-tight">
      Family life is heavy.<br />
      <span class="text-brand-teal italic">Let&rsquo;s make it Lite.</span>
    </h1>
    <p class="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl brand-muted mb-8 sm:mb-10 leading-relaxed">
      The collaborative digital space designed to offload the practical
      details of home life&mdash;money, bills, dates, and documents. Built for
      distributed families who want less friction and more clarity.
    </p>
    <a
      href="https://app.familite.co"
      class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition shadow-2xl shadow-brand-teal-light/30 brand-primary-btn"
    >
      Build Your Family Space &mdash; Free
    </a>

    <!-- Store badges -->
    <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
      <a href="https://app.familite.co" class="brand-app-badge" aria-label="Download on the App Store">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.5 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3.1.9-3.9.9s-2-.9-3.4-.9c-1.7 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.7-1-2.9-4.1zM15 4.4c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/>
        </svg>
        <span>
          <span class="brand-badge-line-1">Download on the</span>
          <span class="brand-badge-line-2">App Store</span>
        </span>
      </a>
      <a href="https://app.familite.co" class="brand-play-badge" aria-label="Get it on Google Play">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <linearGradient id="gp1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#00d2ff"/>
              <stop offset="1" stop-color="#3a7bd5"/>
            </linearGradient>
            <linearGradient id="gp2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ffd200"/>
              <stop offset="1" stop-color="#f7971e"/>
            </linearGradient>
            <linearGradient id="gp3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ff416c"/>
              <stop offset="1" stop-color="#ff4b2b"/>
            </linearGradient>
            <linearGradient id="gp4" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#43e97b"/>
              <stop offset="1" stop-color="#38f9d7"/>
            </linearGradient>
          </defs>
          <path d="M3.6 2.3 13.5 12 3.6 21.7c-.4-.2-.6-.6-.6-1V3.3c0-.4.2-.8.6-1z" fill="url(#gp1)"/>
          <path d="M17.4 8.1 13.5 12l3.9 3.9 3.4-2c.7-.4.7-1.4 0-1.8l-3.4-2z" fill="url(#gp2)"/>
          <path d="M3.6 21.7 13.5 12l3.9 3.9-12 6.9c-.6.3-1.4-.1-1.8-.7z" fill="url(#gp3)"/>
          <path d="M3.6 2.3 13.5 12l3.9-3.9-12-6.9c-.6-.4-1.4 0-1.8.6z" fill="url(#gp4)"/>
        </svg>
        <span>
          <span class="brand-badge-line-1">Get it on</span>
          <span class="brand-badge-line-2">Google Play</span>
        </span>
      </a>
    </div>

    <p class="mt-3 text-xs brand-muted">Web &middot; iPadOS also available</p>

    <!-- Web + phone composition -->
    <div class="mt-12 sm:mt-16 relative">
      <!-- Gradient only in light mode; dark mode uses uniform background -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-transparent z-10 pointer-events-none dark:opacity-0"
      ></div>
      <div class="relative max-w-5xl mx-auto">
        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden bg-white dark:bg-gray-800 transition-transform hover:scale-[1.005]"
        >
          <img
            src="assets/dashboard_main.png"
            alt="Familite Dashboard on the web"
            class="w-full h-auto"
            loading="eager"
          />
        </div>
        <!-- Phone overlapping bottom-right on lg+; stacks below on smaller widths -->
        <div class="mt-8 lg:mt-0 lg:absolute lg:-right-4 lg:-bottom-12 lg:w-[18%] flex justify-center">
          <div class="brand-phone-frame w-44 sm:w-52 lg:w-full">
            <img src="assets/mobile_hero.png" alt="Familite mobile app" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
```

- [ ] **Step 3: Visual smoke test**

Open `index.html` in browser at desktop width (≥1024px):
- Hero shows web dashboard card + phone frame overlapping its bottom-right corner.
- Two badges (App Store + Google Play) are centered under the green CTA, above the screenshot composition.
- Microcopy "Web · iPadOS also available" sits below the badges.

Resize to <1024px:
- Phone frame stacks below the web card, both centered.

If `assets/mobile_hero.png` is missing, the phone frame will show a broken-image icon. That's expected until the user drops in the screenshot — confirm the frame itself renders correctly (rounded-corner dark phone-shaped container).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Refresh hero with web+phone composition and store badges"
```

---

### Task 4: Update Mental Load comparison band copy

Replace stale bullets in the comparison band (timezone math, Vertex AI mention) with copy that matches the shipped product (bills, todos, AI bill drafting).

**Files:**
- Modify: `index.html:152-182` (the `<section class="py-20 bg-white border-y border-gray-100">` block)

**Steps:**

- [ ] **Step 1: Locate the two bullet lists**

The section contains two `<ul>` blocks. Left column (red): "Mental Load". Right column (teal): "Familite Way".

- [ ] **Step 2: Replace the left column `<ul>` (Mental Load)**

Find this block (around lines 160–165):

```html
<ul class="space-y-3 brand-muted text-sm">
  <li>&bull; Texting "Where is the nanny's number?".</li>
  <li>&bull; Manual timezone math for family calls.</li>
  <li>&bull; Digging through emails for bank PDFs.</li>
  <li>&bull; Losing track of visa expiration dates.</li>
</ul>
```

(Note: actual file uses `•` characters; preserve that form.)

Replace with:

```html
<ul class="space-y-3 brand-muted text-sm">
  <li>&bull; Texting "Where is the nanny's number?".</li>
  <li>&bull; Bill due dates buried in three different inboxes.</li>
  <li>&bull; Digging through emails for bank PDFs.</li>
  <li>&bull; Losing track of visa expiration dates.</li>
</ul>
```

- [ ] **Step 3: Replace the right column `<ul>` (Familite Way)**

Find this block (around lines 173–178):

```html
<ul class="space-y-3 brand-muted text-sm">
  <li>&bull; A permanent "Wiki" for every detail.</li>
  <li>&bull; Live, timezone-aware event syncing.</li>
  <li>&bull; AI-powered transaction parsing (via Google Vertex AI).</li>
  <li>&bull; A shared Vault for every family document.</li>
</ul>
```

Replace with:

```html
<ul class="space-y-3 brand-muted text-sm">
  <li>&bull; A permanent "Wiki" for every detail.</li>
  <li>&bull; One timeline for events, todos, and bills.</li>
  <li>&bull; AI-drafted transactions and bills you approve.</li>
  <li>&bull; A shared Vault for every family document.</li>
</ul>
```

- [ ] **Step 4: Visual smoke test**

Reload `index.html`. The comparison band's left column now reads "Bill due dates buried in three different inboxes" (replacing the timezone-math line). Right column now mentions "One timeline for events, todos, and bills" and "AI-drafted transactions and bills you approve". No layout shift.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Refresh comparison band to mention bills, todos, and timeline"
```

---

### Task 5: Update Money section — rename, add bullet, add phone overlay

The current Finance section becomes Money: keeps copy mostly intact, adds a third bullet ("Pulse Across Accounts"), changes the section anchor + badge, and adds a phone mockup overlapping the existing visuals.

**Files:**
- Modify: `index.html:184-277` (the `<section id="finance" ...>` block)

**Steps:**

- [ ] **Step 1: Replace the entire Money section**

Replace the existing `<section id="finance" ...>` ... `</section>` block (currently lines 184–277) with this exact block:

```html
<section id="money" class="py-24 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-16 items-start">
      <div class="lg:sticky lg:top-32">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20 dark:text-brand-teal-light text-xs font-bold uppercase mb-4 tracking-wider">
          Money
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Smart Money Management. <br />Zero Manual Entry.
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Upload bank statements and let Familite do the work. You stay in
          control with a simple verification wizard.
        </p>
        <ul class="space-y-6">
          <li class="flex items-start gap-4">
            <div class="mt-1 bg-brand-teal rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">Smart Parsing &amp; Review</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Upload a PDF statement; our engine extracts draft transactions
                you confirm and categorize.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-4">
            <div class="mt-1 bg-brand-teal rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">Multi-Currency Native</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Track expenses across currencies. Each transaction preserves
                both the original and settled amounts as they appear on your
                bank statement.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-4">
            <div class="mt-1 bg-brand-teal rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">Pulse Across Accounts</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                One view of cash flow across every account, with category
                breakdowns and trend lines.
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="relative space-y-6 overflow-visible">
        <img
          src="assets/money_multi_currency.png"
          alt="Multi-currency finances"
          class="w-full h-auto max-w-full rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800"
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <img
            src="assets/import_transactions.png"
            alt="Import data"
            class="w-full h-auto max-w-full rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
          />
          <img
            src="assets/review_transaction.png"
            alt="Review flow"
            class="w-full h-auto max-w-full rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
          />
        </div>
        <!-- Mobile mockup overlapping bottom-right of visuals stack -->
        <div class="mt-6 lg:mt-0 lg:absolute lg:-right-4 lg:-bottom-8 flex justify-center">
          <div class="brand-phone-frame w-40 sm:w-44 lg:w-44">
            <img src="assets/mobile_money.png" alt="Money on mobile" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Visual smoke test**

Reload `index.html`. Section anchor is now `#money`. Badge text is `Money`. Three bullets show (Smart Parsing, Multi-Currency, Pulse Across Accounts). On `lg+` widths, a phone frame overlaps the bottom-right of the visuals stack. On smaller widths, the phone stacks below.

If `assets/mobile_money.png` is missing, the phone frame shows a broken image. That's expected until user drops in.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rename Finance section to Money and add Pulse bullet plus phone overlay"
```

---

### Task 6: Add Bills section between Money and Planning

New top-level feature section. Goes immediately after the Money section, before the Planning section.

**Files:**
- Modify: `index.html` — insert new section after the Money section (which ends with `</section>` after the new Pulse-bullet block from Task 5) and before `<section id="planning" ...>`.

**Steps:**

- [ ] **Step 1: Locate insertion point**

Find the closing `</section>` of the Money block (now `<section id="money" ...>`). Immediately after it, find the start of the existing Planning block: `<section id="planning" class="py-24 brand-soft-section">`.

Insert the new Bills section between them.

- [ ] **Step 2: Insert the Bills section**

Insert this exact block on a new line between the Money `</section>` and the `<section id="planning" ...>` opening tag:

```html
<section id="bills" class="py-24 brand-soft-section">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-16 items-start">
      <div class="order-2 lg:order-1 relative space-y-6 overflow-visible">
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden bg-white dark:bg-gray-800">
          <div class="aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-brand-teal/5 to-brand-teal/15 text-brand-teal text-sm tracking-wide uppercase">
            Bills inbox screenshot &mdash; drop into <code class="ml-1 font-mono text-xs">assets/bills_inbox.png</code>
          </div>
        </div>
        <!-- Phone frame -->
        <div class="mt-6 lg:mt-0 lg:absolute lg:-right-4 lg:-bottom-8 flex justify-center">
          <div class="brand-phone-frame w-40 sm:w-44 lg:w-44">
            <img src="assets/mobile_bills.png" alt="Bills on mobile" loading="lazy" />
          </div>
        </div>
      </div>
      <div class="order-1 lg:order-2 lg:sticky lg:top-32">
        <div class="brand-badge brand-badge-warning mb-4">
          Bills
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Never miss a due date again.
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          One inbox for every household bill &mdash; utilities, subscriptions,
          school fees, insurance. Forward, upload, or paste; we draft the
          bill, you approve, the family stays informed.
        </p>
        <ul class="space-y-6">
          <li class="flex items-start gap-4">
            <div class="mt-1 bg-brand-teal rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">Bill Inbox</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Drop in PDFs or forward emails to your family's inbox address.
                Familite parses amount, due date, and payee into a draft bill
                for review.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-4">
            <div class="mt-1 bg-brand-teal rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">Track &amp; Stay Ahead</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Mark paid, snooze, or set a due date. Everyone sees what's
                outstanding at a glance, no chasing required.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-4">
            <div class="mt-1 bg-brand-teal rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">Shared Visibility</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Bills surface alongside events and todos in Planning, so the
                household sees what's coming due without asking.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

Note: The web visuals column uses a placeholder card (`Bills inbox screenshot — drop into assets/bills_inbox.png`) because no Bills web screenshot exists yet. When the user drops `bills_inbox.png` into `assets/`, replace the entire `<div class="aspect-[16/10] ...">` with `<img src="assets/bills_inbox.png" alt="Bills inbox" class="w-full h-auto" />`.

- [ ] **Step 3: Visual smoke test**

Reload `index.html`. Section order should now read: Money → **Bills** → Planning → Vault. The Bills section uses the Planning section's soft background, has the warning-badge color (yellow-ish), and visuals are on the LEFT (alternating from Money's visuals-on-right rhythm). Three bullets render. Phone frame on `lg+` overlaps the placeholder card. Anchor `#bills` works (clicking the new nav link scrolls here).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add Bills feature section between Money and Planning"
```

---

### Task 7: Rewrite Planning section copy and add phone overlay

Replace the calendar/timezone copy with the actual shipped product (timeline of events + todos + bills, day/week view, filter by type). Add phone mockup.

**Files:**
- Modify: `index.html` — the `<section id="planning" ...>` block (after Task 6 insertion, this is now the section *after* Bills)

**Steps:**

- [ ] **Step 1: Replace the entire Planning section**

Find the existing `<section id="planning" class="py-24 brand-soft-section">` ... `</section>` block (originally lines 279–345; offsets shift after Tasks 5–6). Replace its entire contents with this exact block:

```html
<section id="planning" class="py-24 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-16 items-start">
      <div class="lg:sticky lg:top-32">
        <div class="brand-badge brand-badge-info mb-4">
          Planning
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          One timeline. <br />Events, todos, bills.
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Stop juggling three apps for what's happening, what needs doing,
          and what's owed. Planning gives the family a single day-or-week
          timeline of everything coming up &mdash; filter by type when you
          need to focus.
        </p>
        <ul class="space-y-6">
          <li class="flex items-start gap-4">
            <div class="mt-1 bg-brand-info rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">Day &amp; Week Timeline</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                See today or this week at a glance. Overdue items surface at
                the top; anytime todos sit alongside scheduled work.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-4">
            <div class="mt-1 bg-brand-info rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">Filter by Type</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Tap to see just events, just todos, or just bills. Default
                view weaves them together by date.
              </p>
            </div>
          </li>
          <li class="flex items-start gap-4">
            <div class="mt-1 bg-brand-info rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">Color-Coded by Member</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Each family member's items carry their color, so you can scan
                who's responsible at a glance.
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="relative space-y-6 overflow-visible">
        <img
          src="assets/calendar_main.png"
          alt="Planning timeline on the web"
          class="w-full h-auto max-w-full rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800"
        />
        <!-- Mobile mockup -->
        <div class="mt-6 lg:mt-0 lg:absolute lg:-right-4 lg:-bottom-8 flex justify-center">
          <div class="brand-phone-frame w-40 sm:w-44 lg:w-44">
            <img src="assets/mobile_planning.png" alt="Planning on mobile" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Note: This swaps Planning's section background from `brand-soft-section` (gray) to `bg-white` for visual rhythm — Money is white, Bills is gray, Planning is white, Vault is white. Matches the alternating soft/white pattern.

Update: actually let me reconsider — checking back, Vault was `bg-white dark:bg-gray-900` and the original layout alternated soft/white. After this plan: Money white → Bills soft → Planning white → Vault white reads as two whites in a row. To preserve alternation, change Planning back to `brand-soft-section`.

Actually — replace the opening tag in the block above:

```html
<section id="planning" class="py-24 bg-white dark:bg-gray-900">
```

with:

```html
<section id="planning" class="py-24 brand-soft-section">
```

So the rhythm becomes: Money white → Bills soft → Planning soft → Vault white. That's two softs in a row. Hmm.

Best: Money white → Bills soft → Planning white → Vault soft. To do that, also change Vault to soft in Task 8.

**Decision:** Use this final order — Money white, Bills soft, Planning white, Vault soft. Apply Planning = `bg-white dark:bg-gray-900` (the version above), and in Task 8 change Vault from `bg-white dark:bg-gray-900` to `brand-soft-section`. This keeps strict alternation.

- [ ] **Step 2: Visual smoke test**

Reload `index.html`. Planning section badge says `Planning`. Headline is "One timeline. Events, todos, bills.". Three bullets (Day & Week Timeline, Filter by Type, Color-Coded by Member). Visuals column is on the right with a phone frame overlapping its bottom-right on `lg+`. Section background is white (alternating from gray Bills). No mention of "Google Calendar Sync" or "timezone" in the bullets.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rewrite Planning section to reflect timeline of events, todos, and bills"
```

---

### Task 8: Add phone overlay to Vault section and switch background

Add the mobile mockup to the Vault section. Switch Vault's background from white to soft to maintain alternation (Money W → Bills S → Planning W → Vault S).

**Files:**
- Modify: `index.html` — the `<section id="vault" ...>` block

**Steps:**

- [ ] **Step 1: Locate the Vault section**

Find `<section id="vault" class="py-24 bg-white dark:bg-gray-900">`. The vault image currently lives at the bottom of the section (`<img src="assets/vault_main.png" ...>`).

- [ ] **Step 2: Switch background and wrap the existing vault image with a phone overlay**

In the Vault section, change the opening tag:

From:
```html
<section id="vault" class="py-24 bg-white dark:bg-gray-900">
```

To:
```html
<section id="vault" class="py-24 brand-soft-section">
```

Then find the existing standalone vault image:

```html
<img
  src="assets/vault_main.png"
  alt="The Familite Vault"
  class="w-full h-auto max-w-5xl mx-auto rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800"
/>
```

Replace it with this composition:

```html
<div class="relative max-w-5xl mx-auto">
  <img
    src="assets/vault_main.png"
    alt="The Familite Vault on the web"
    class="w-full h-auto rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800"
  />
  <!-- Mobile mockup -->
  <div class="mt-8 lg:mt-0 lg:absolute lg:-right-4 lg:-bottom-12 lg:w-[16%] flex justify-center">
    <div class="brand-phone-frame w-40 sm:w-44 lg:w-full">
      <img src="assets/mobile_vault.png" alt="Vault on mobile" loading="lazy" />
    </div>
  </div>
</div>
```

- [ ] **Step 3: Visual smoke test**

Reload `index.html`. Vault section now has the soft gray background. The web vault screenshot still anchors the bottom of the section, with a phone frame overlapping its bottom-right on `lg+`. Below `lg`, phone stacks under it.

The page background rhythm now reads: Money (white) → Bills (gray) → Planning (white) → Vault (gray). Privacy section follows next (dark), preserving variety.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add mobile mockup to Vault section and switch to soft background"
```

---

### Task 9: Add badges to bottom CTA section

The bottom "Get Early Access" CTA gets the same badge pair that the hero does, immediately under the existing button.

**Files:**
- Modify: `index.html` — the `<section class="py-24 brand-soft-section relative overflow-hidden text-center">` block near the end of the page

**Steps:**

- [ ] **Step 1: Locate the bottom CTA**

Find the section containing this CTA button:

```html
<a
  href="https://app.familite.co"
  class="inline-flex items-center justify-center px-10 py-5 text-xl font-semibold rounded-xl hover:scale-105 transition shadow-2xl shadow-brand-teal/30 brand-primary-btn"
>
  Get Early Access &mdash; Free
</a>
```

(Note: actual file uses `—` directly; preserve.)

- [ ] **Step 2: Add badge group immediately after the closing `</a>`**

Insert this block immediately after the closing `</a>` of "Get Early Access — Free":

```html

<div class="mt-6 flex flex-wrap items-center justify-center gap-3">
  <a href="https://app.familite.co" class="brand-app-badge" aria-label="Download on the App Store">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3.1.9-3.9.9s-2-.9-3.4-.9c-1.7 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.7-1-2.9-4.1zM15 4.4c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/>
    </svg>
    <span>
      <span class="brand-badge-line-1">Download on the</span>
      <span class="brand-badge-line-2">App Store</span>
    </span>
  </a>
  <a href="https://app.familite.co" class="brand-play-badge" aria-label="Get it on Google Play">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="gp1b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#00d2ff"/>
          <stop offset="1" stop-color="#3a7bd5"/>
        </linearGradient>
        <linearGradient id="gp2b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffd200"/>
          <stop offset="1" stop-color="#f7971e"/>
        </linearGradient>
        <linearGradient id="gp3b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ff416c"/>
          <stop offset="1" stop-color="#ff4b2b"/>
        </linearGradient>
        <linearGradient id="gp4b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#43e97b"/>
          <stop offset="1" stop-color="#38f9d7"/>
        </linearGradient>
      </defs>
      <path d="M3.6 2.3 13.5 12 3.6 21.7c-.4-.2-.6-.6-.6-1V3.3c0-.4.2-.8.6-1z" fill="url(#gp1b)"/>
      <path d="M17.4 8.1 13.5 12l3.9 3.9 3.4-2c.7-.4.7-1.4 0-1.8l-3.4-2z" fill="url(#gp2b)"/>
      <path d="M3.6 21.7 13.5 12l3.9 3.9-12 6.9c-.6.3-1.4-.1-1.8-.7z" fill="url(#gp3b)"/>
      <path d="M3.6 2.3 13.5 12l3.9-3.9-12-6.9c-.6-.4-1.4 0-1.8.6z" fill="url(#gp4b)"/>
    </svg>
    <span>
      <span class="brand-badge-line-1">Get it on</span>
      <span class="brand-badge-line-2">Google Play</span>
    </span>
  </a>
</div>
```

(Note: gradient IDs end with `b` here to avoid SVG `id` collisions with the hero badges from Task 3.)

- [ ] **Step 3: Visual smoke test**

Reload `index.html`. Scroll to the very bottom CTA section. Both badges appear directly under the "Get Early Access — Free" button, centered and matching the hero's badge pair.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add App Store and Play Store badges to bottom CTA"
```

---

### Task 10: Add Bill Uploads & AI Parsing block to privacy.html

New subsection mirroring the existing "Financial Statements (Money)" + "AI-Assisted Processing" pair. Same structure, same emphasis on Vertex AI request-scoping and user-controlled deletion.

**Files:**
- Modify: `privacy.html` — within the `What we collect (and why)` section, after subsection "2a. AI-Assisted Processing (Google Vertex AI)" and before subsection "3. The Vault"

**Steps:**

- [ ] **Step 1: Locate insertion point**

In `privacy.html`, find the closing `</div>` of subsection 2a (ends after the line that contains `Uploaded PDFs are stored securely in our Google Cloud Storage infrastructure ...`). The next sibling `<div>` opens subsection "3. The Vault (Documents & Links)".

- [ ] **Step 2: Insert two new subsections (Bills + Email Forwarding) between 2a and 3**

Between the closing `</div>` of subsection 2a and the opening `<div>` of subsection 3, insert this exact block:

```html
<div class="border-l-4 border-brand-teal/15 dark:border-brand-teal/30 pl-6">
  <h4 class="font-bold text-gray-900 dark:text-white">2b. Bills (Uploads &amp; Forwarded Emails)</h4>
  <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
    When you upload a bill PDF or forward a bill email, we store the source file (PDF or email body and any attachments) securely in <strong>Google Cloud Storage</strong>. The source is processed by <strong>Google Vertex AI</strong> (Gemini) to extract a draft bill (amount, due date, payee), which you review, confirm, and edit before saving.
  </p>
  <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
    As with bank statements, we do not use your bill documents to train AI models, and Vertex AI does not retain your content after processing. Original PDFs and forwarded email bodies are retained while your account is active so you can reference them; you may request deletion of any uploaded or forwarded bill at any time.
  </p>
  <p class="text-gray-600 dark:text-gray-400 text-sm">
    Recurring or repeated bills are not auto-created on your behalf &mdash; each bill is parsed from a source you provide, and you control whether it is saved.
  </p>
</div>
<div class="border-l-4 border-brand-teal/15 dark:border-brand-teal/30 pl-6">
  <h4 class="font-bold text-gray-900 dark:text-white">2c. Bill Email Forwarding</h4>
  <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
    Each family workspace is assigned an auto-generated forwarding address (for example <code class="font-mono text-xs">bills+&lt;family-id&gt;@familite.co</code>). Emails sent to this address are processed by the same Vertex AI parsing pipeline described in Section 2b.
  </p>
  <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
    We retain the sender address, subject, headers, body, and attachments of forwarded emails alongside the parsed draft so you can verify what was extracted. Forwarded emails are scoped to the receiving family workspace only and are not visible to other families.
  </p>
  <p class="text-gray-600 dark:text-gray-400 text-sm">
    Future paid tiers may allow you to customize the forwarding address. Data handling, retention, and deletion rights are unchanged across tiers.
  </p>
</div>
```

- [ ] **Step 3: Add Planning timeline clarification under subsection 4 (Calendar)**

Find subsection "4. Google Calendar (when you connect it)". Within it, locate the final `<p class="text-gray-600 dark:text-gray-400 text-sm italic">` (the one starting with "Calendar data is used only to provide calendar sync, family visibility..."). Immediately *after* that closing `</p>`, but still inside the section's outer `<div>`, add this paragraph:

```html
<p class="text-gray-600 dark:text-gray-400 text-sm mt-3">
  <strong>Planning view:</strong> the Planning page in Familite displays your events, todos, and bills together in a single timeline. It does not introduce new data types beyond those covered in this section and Sections 2b and 2c. Google Calendar sync is governed by the policies above; todos and bills are governed by Sections 2b, 2c, and the data-retention list below.
</p>
```

- [ ] **Step 4: Add Todos retention bullet**

Find the `Data Retention` section (`<h3>Data Retention</h3>`). Within its `<ul class="list-disc pl-6 ...">`, after the `<li>` for `Vault files & links` and before the `<li>` for `Google Calendar data`, insert:

```html
<li><strong>Todos:</strong> Retained while your account is active. You can delete individual todos at any time from within the app.</li>
<li><strong>Bills (drafts &amp; saved):</strong> Retained while your account is active. Source PDFs and forwarded emails follow the same retention as Section 2b; you may request deletion of any bill or its source at any time by contacting <strong>privacy@familite.co</strong>.</li>
```

- [ ] **Step 5: Update the "Last Updated" date**

Find the line near the top of `privacy.html` reading:

```html
First Created: March 2026 | Last Updated: April 4, 2026
```

Update to:

```html
First Created: March 2026 | Last Updated: May 8, 2026
```

- [ ] **Step 6: Visual smoke test**

Open `privacy.html` in browser. Scroll to "What we collect (and why)" — should now have subsections 1, 2, 2a, **2b (Bills)**, **2c (Bill Email Forwarding)**, 3, 4. Calendar subsection ends with the new "Planning view" paragraph. Data Retention list now includes Todos and Bills entries. Date stamp shows "May 8, 2026".

- [ ] **Step 7: Commit**

```bash
git add privacy.html
git commit -m "Add Bills, Email Forwarding, Todos, and Planning sections to privacy policy"
```

---

### Task 11: Add Bills disclaimer + payment liability to terms.html

**Files:**
- Modify: `terms.html` — within "3. Use of AI & Financial Data" section

**Steps:**

- [ ] **Step 1: Locate Section 3**

In `terms.html`, find:

```html
<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
  3. Use of AI &amp; Financial Data
</h2>
```

The section currently mentions only bank statement parsing and contains a `<ul>` with two `<li>` items.

- [ ] **Step 2: Replace the section body to cover bills + non-payment**

Replace the existing section body (everything from the introductory `<p>` through the closing `</section>`, but keeping the `<h2>` heading) with this exact body:

```html
<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
  3. Use of AI &amp; Financial Data
</h2>
<p class="mb-4">
  Our Service includes automated &ldquo;Smart Parsing&rdquo; features for bank
  statements and bills, powered by <strong>Google Vertex AI</strong> (Gemini).
</p>
<ul class="list-disc pl-6 space-y-2 text-sm">
  <li>
    <strong>Verification Required (Transactions):</strong> You acknowledge
    that our AI engine extracts &ldquo;draft&rdquo; transactions which may
    contain errors. You are responsible for using the Verification Wizard to
    confirm and edit transactions before they are saved to your ledger.
  </li>
  <li>
    <strong>Verification Required (Bills):</strong> AI-extracted bills (from
    PDFs you upload or emails you forward to your family's bill inbox) are
    drafts and may contain inaccuracies. You are responsible for reviewing,
    confirming, and editing bills before saving them.
  </li>
  <li>
    <strong>Familite Does Not Pay Bills.</strong> Familite tracks bills and
    helps you stay on top of due dates. We do not process payments, hold
    funds, set up autopay, or initiate transfers on your behalf. Marking a
    bill as paid within the Service is a record-keeping action only and does
    not move money.
  </li>
  <li>
    <strong>Email Forwarding for Bills.</strong> When you forward an email to
    your family's bill inbox address, the email and any attachments are
    processed by the AI parsing pipeline described above, subject to the
    Privacy Policy.
  </li>
  <li>
    <strong>No Financial Advice.</strong> familite.co is a record-keeping and
    coordination tool, not a financial advisor or bill-pay service. We are
    not responsible for any financial decisions, missed payments, late fees,
    or losses resulting from the use of the Service.
  </li>
</ul>
```

- [ ] **Step 3: Update the "Last Updated" date**

Search for "Last Updated" near the top of `terms.html` and update the date to "May 8, 2026" (matching `privacy.html`'s update). If the file has no such stamp, skip this step.

- [ ] **Step 4: Visual smoke test**

Open `terms.html`. Section 3 now shows five bullets covering Transactions, Bills, Familite-Does-Not-Pay-Bills, Email Forwarding, and No Financial Advice.

- [ ] **Step 5: Commit**

```bash
git add terms.html
git commit -m "Add Bills parsing, payment liability, and email forwarding to terms"
```

---

### Task 12: Add cross-platform line to about.html

**Files:**
- Modify: `about.html` — Our Core Philosophy section

**Steps:**

- [ ] **Step 1: Locate the Core Philosophy grid**

In `about.html`, find the section with the heading `Our Core Philosophy`. Inside, there is a `<div class="grid md:grid-cols-3 gap-8 sm:gap-12">` containing three `<div>` pillar cards: "A Single Source of Truth", "Storage-Agnostic Freedom", "Privacy as a Right".

- [ ] **Step 2: Change grid to 4 columns and add a fourth pillar**

Change the opening grid line from:

```html
<div class="grid md:grid-cols-3 gap-8 sm:gap-12">
```

To:

```html
<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
```

Then, immediately before the closing `</div>` of that grid (right after the "Privacy as a Right" pillar's closing `</div>`), insert this fourth pillar:

```html
<div>
  <h3 class="font-bold text-xl text-gray-900 dark:text-white mb-4">
    On Every Surface
  </h3>
  <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
    Familite is one product across <strong>Web, iOS, iPadOS, and Android</strong>.
    Your family's space, on whatever device they reach for &mdash; built once,
    delivered everywhere.
  </p>
</div>
```

- [ ] **Step 3: Optional Organizer card edit**

Find "The Organizer" card and the line `automation (like PDF parsing) to stop the manual admin`. Replace the parenthetical with `(like PDF parsing for statements and bills)`. Single-word edit; preserves voice.

Resulting sentence:

```html
We give you the
automation (like PDF parsing for statements and bills) to stop the manual
admin and start leading.
```

- [ ] **Step 4: Visual smoke test**

Open `about.html`. Core Philosophy now shows 4 pillars (2x2 on `md`, 4-up on `lg`). Fourth pillar is "On Every Surface" mentioning Web/iOS/iPadOS/Android. Organizer card mentions "PDF parsing for statements and bills".

- [ ] **Step 5: Commit**

```bash
git add about.html
git commit -m "Add cross-platform pillar to about page and mention bills in Organizer copy"
```

---

### Task 13: End-to-end visual smoke test

Final pass. Run a local server and click through every page at three viewport widths.

**Steps:**

- [ ] **Step 1: Start a local static server**

```bash
cd /Users/imantumorang/familite/familite.co
python3 -m http.server 8765
```

Open `http://localhost:8765/index.html` in the browser.

- [ ] **Step 2: Desktop check (≥1280px)**

Verify each, scrolling through `index.html`:
1. Nav reads `Money · Bills · Planning · Vault · [Join Beta]`. Each nav link scrolls to its section.
2. Hero shows web dashboard card with phone frame overlapping its bottom-right; App Store + Play Store badges sit below the CTA; muted "Web · iPadOS also available" line below badges.
3. Comparison band has updated bullets (no timezone-math, mentions bills + todos).
4. Money section: white background, badge says `Money`, three bullets including "Pulse Across Accounts", phone frame overlaps bottom-right of visuals stack.
5. Bills section: soft gray background, warning badge `Bills`, three bullets, visuals on the left with phone frame overlapping bottom-right of (placeholder) bills web shot.
6. Planning section: white background, info badge, "One timeline. Events, todos, bills." headline, three bullets, phone frame overlapping bottom-right of `calendar_main.png`.
7. Vault section: soft gray background, vault content unchanged but phone frame overlaps the existing vault image's bottom-right.
8. Bottom CTA: badges below the "Get Early Access — Free" button.
9. Footer unchanged.

Open `about.html` — Core Philosophy has 4 pillars, fourth is "On Every Surface".

Open `privacy.html` — "What we collect" has subsections 2b (Bills) and 2c (Bill Email Forwarding); Data Retention list includes Todos and Bills entries; Calendar section ends with the Planning paragraph; date stamp updated.

Open `terms.html` — Section 3 has five bullets including Bills verification, Familite-Does-Not-Pay-Bills, Email Forwarding.

- [ ] **Step 3: Tablet check (~768px)**

Resize the browser to ~768px wide. Verify each section's two-column grid collapses to one column, phone frames stack below web shots and stay centered. Nav still shows all four section links. Bills section's order swap (visuals first vs copy first) collapses cleanly.

- [ ] **Step 4: Mobile check (~390px)**

Resize to ~390px. Verify:
- Nav section links hidden (only logo + Join Beta visible) — original behavior preserved.
- All sections stack as single columns.
- Phone frames are `w-44` (~176px) and centered.
- Badge group wraps to two rows or stays inline depending on space, but neither badge overflows.
- No horizontal scrollbar at any section.

- [ ] **Step 5: Dark mode check**

In macOS System Settings or browser devtools, toggle dark mode. Verify:
- Nav, headings, copy all use the dark variants.
- Phone frame's dark bezel still reads as a phone (the `--brand-gray-900` background stays visible).
- App Store and Google Play badges (always black background) remain readable.
- No text contrast regressions in the new sections.

- [ ] **Step 6: Stop the server and finalize**

Stop the local server (Ctrl-C). Run a final `git status` to confirm no unintended files; `git log --oneline -20` to review the commit chain.

```bash
git status
git log --oneline -20
```

Expected: clean working tree; commit log shows the sequence of focused commits from Tasks 1–12.

- [ ] **Step 7: Final summary commit (only if any cleanup edits were made during the smoke test)**

If the smoke test surfaced any small fixes (typos, alignment tweaks), commit them in a single follow-up:

```bash
git add -p
git commit -m "Polish: smoke-test fixes for landing page web+mobile update"
```

If no fixes were needed, no commit. Done.

---

## Self-review

**Spec coverage:**
- Page structure (Money / Bills / Planning / Vault) → Tasks 5–8 ✓
- Hero web+phone composition → Task 3 ✓
- Per-section phone overlap pattern → Tasks 5, 6, 7, 8 ✓
- Money copy refresh + Pulse bullet → Task 5 ✓
- New Bills section copy → Task 6 ✓
- Planning rewrite → Task 7 ✓
- Vault unchanged copy + phone → Task 8 ✓
- Comparison band copy edits → Task 4 ✓
- Nav: rename + add Bills → Task 2 ✓
- CTAs unchanged + badges in hero & bottom → Tasks 3, 9 ✓
- "Web · iPadOS also available" microcopy → Task 3 ✓
- Mobile screenshots referenced by exact filenames → Tasks 3, 5, 6, 7, 8 ✓
- privacy.html additions (Bills, Email Forwarding, Todos, Planning clarification) → Task 10 ✓
- terms.html additions (Bills disclaimer, doesn't-pay-bills, forwarding) → Task 11 ✓
- about.html cross-platform line + optional Organizer edit → Task 12 ✓

**Placeholder scan:** No `TBD` / `TODO` / "fill in later" anywhere in the plan. The Bills section's web visual uses an explicit placeholder card (Task 6) with a literal swap instruction — that's a documented stand-in, not a planning gap. Mobile screenshot filenames are exact; missing files render as broken images during smoke test, which is documented.

**Type/identifier consistency:** CSS class names (`brand-phone-frame`, `brand-app-badge`, `brand-play-badge`, `brand-badge-line-1`, `brand-badge-line-2`) are defined in Task 1 and used consistently in Tasks 3, 5, 6, 7, 8, 9. Section IDs (`#money`, `#bills`, `#planning`, `#vault`) match the nav links from Task 2. SVG gradient `id` collision avoided by using `gp1`...`gp4` in hero and `gp1b`...`gp4b` in bottom CTA. Mobile image filenames consistent across tasks: `mobile_hero.png`, `mobile_money.png`, `mobile_bills.png`, `mobile_planning.png`, `mobile_vault.png`.

**Background alternation rhythm:** Money (white) → Bills (soft) → Planning (white) → Vault (soft). Verified across Tasks 5, 6, 7, 8.
