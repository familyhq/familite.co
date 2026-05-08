# Landing Page Update — Web Dashboard + Mobile App

**Date:** 2026-05-08
**Target launch:** 2026-06-10 (closed beta on both web and mobile)
**Scope:** `familite.co/index.html` (full update) + targeted **additions** to `about.html`, `privacy.html`, `terms.html` covering Bills, Todos, Planning timeline, and mobile surfaces. No rewriting of existing copy on the secondary pages.

---

## Goal

Update the marketing site to position Familite as a single product available on **Web + iOS + Android + iPadOS** (all in closed beta). Add Bills as a first-class feature (currently absent), rewrite Planning to match the shipped product (timeline of events + todos + bills, not a calendar), and surface mobile alongside web in every feature section.

---

## Why

1. **Mobile is shipping.** By 2026-06-10 the KMP app (`familite-mobile`) has feature parity with the web dashboard. The current landing page shows web-only screenshots in the hero and every section, which undersells the product.
2. **Bills is missing entirely** from the page despite being a top-level dashboard route (`/bills`) and a parsed-from-PDF/email inbox feature.
3. **Planning copy is stale.** The page describes "Google Calendar Sync" and "Smart Scheduler for Distributed Families" — neither matches what shipped. Real Planning is a unified day-or-week timeline of events + todos + bills with tab filters (`all | events | todos | bills`).

---

## Constraints

- **Do not rewrite or refactor** existing About / Privacy / Terms copy. Additions only, in dedicated new paragraphs / list items, for the new product surfaces (Bills, Todos, Planning timeline, mobile).
- Keep closed-beta framing — no App Store / Play Store badges.
- Single CTA destination (`https://app.familite.co`); keep existing button copy.
- No image compositing in Photoshop — page must render web+mobile pairings via HTML/CSS using raw screenshot PNGs.

---

## Page structure

```
CURRENT                          PROPOSED
─────────────────────            ──────────────────────────────
Nav                              Nav (add "Bills", rename Finance→Money)
Hero (web shot only)             Hero (web + phone CSS composition)
Mental Load vs Familite Way      Mental Load vs Familite Way   [copy tweaks]
Finance                          Money                         [renamed + add phone]
                                 Bills                         [NEW + phone]
Planning (calendar copy)         Planning                      [REWRITTEN + phone]
Vault                            Vault                         [add phone]
Privacy by Design                Privacy by Design             [unchanged]
CTA                              CTA                           [unchanged]
Footer                           Footer                        [unchanged]
```

Section anchors: `#money` (was `#finance`), `#bills` (new), `#planning`, `#vault`.

---

## Hero treatment

Above-the-fold conveys "web + mobile, one product" via CSS composition — no composited PNG.

**Layout:**
- Existing `assets/dashboard_main.png` in its current rounded shadow card on the left.
- Phone-shaped frame on the right edge, overlapping the laptop card by ~15–20% on `lg`+ widths. Stacks below on smaller widths.
- Phone frame: rounded-3xl (`~rounded-[2.5rem]`), thin border, `aspect-[9/19.5]`. Inner image gets `rounded-[2rem]`. Soft shadow consistent with the laptop card.
- No notch / home-bar mockup — clean phone silhouette is enough.
- Keep existing teal gradient-fade-to-bottom.

**Surface cue under the CTA:** App Store + Play Store badges side-by-side (official assets), with a small `Web · iPadOS also available` microcopy below in muted text.

**Badge URLs:** point to `https://app.familite.co` for now (same as the Join Beta CTA — clicking funnels into beta signup, no broken-link feel). Swap to actual store URLs once listings go live. Easy single-line edit when ready.

**Badge assets:**
- Apple: official "Download on the App Store" SVG (white/black variants for light/dark).
- Google: official "Get it on Google Play" SVG (same variants).
- Stored in `assets/badges/` (`app_store.svg`, `app_store_dark.svg`, `play_store.svg`, `play_store_dark.svg`).
- Render at ~40px tall, with appropriate clearspace per Apple/Google brand guidelines.

**Hero asset:** `mockups/money-home-top.png` from `familite-mobile/mockups/` (already exists). Money home is the most recognizable mobile screen and matches the web shot's list-view energy.

---

## Per-section web + phone pattern

All four feature sections (Money / Bills / Planning / Vault) use the same shape:

- Two-column grid on `lg`+: copy column left, visual column right (alternates per section to preserve existing rhythm).
- Visual column: web screenshot anchored, phone overlapping the bottom-right corner of the web shot (~30% size).
- Stacks cleanly on `<lg`: phone moves below the web shot, both centered.
- Copy column uses `lg:sticky lg:top-32` on every section (existing Money section already does this — extend to all four).
- Normalize bullets to **3 per section** (currently varies 2–3).

**Why overlap, not equal side-by-side:**
- Equal-size pairs balloon page width and look busy with 4 of them.
- Overlap = web is the anchor, phone punctuates with "and on mobile too." Same idiom in hero and every section keeps the page composed.

---

## Content rewrites

### Money (renamed from Finance)

- **Badge:** Money
- **Headline:** Smart Money Management. Zero Manual Entry. *(unchanged)*
- **Pitch:** unchanged
- **Bullets:**
  1. **Smart Parsing & Review** — Upload a PDF statement; our engine extracts draft transactions you confirm and categorize.
  2. **Multi-Currency Native** — Track expenses across currencies. Each transaction preserves both the original and settled amounts.
  3. **Pulse Across Accounts** — One view of cash flow across every account, with category breakdowns and trend lines.

### Bills (NEW)

- **Badge:** Bills
- **Headline:** Never miss a due date again.
- **Pitch:** One inbox for every household bill — utilities, subscriptions, school fees, insurance. Forward, upload, or paste; we draft the bill, you approve, the family stays informed.
- **Bullets:**
  1. **Bill Inbox** — Drop in PDFs or forward emails to your family's inbox address. Familite parses amount, due date, and payee into a draft bill for review.
  2. **Track & Stay Ahead** — Mark paid, snooze, or set a due date. Everyone sees what's outstanding at a glance, no chasing required.
  3. **Shared Visibility** — Bills surface alongside events and todos in Planning, so the household sees what's coming due without asking.

### Planning (REWRITTEN)

- **Badge:** Planning
- **Headline:** One timeline. Events, todos, bills.
- **Pitch:** Stop juggling three apps for what's happening, what needs doing, and what's owed. Planning gives the family a single day-or-week timeline of everything coming up — filter by type when you need to focus.
- **Bullets:**
  1. **Day & Week Timeline** — See today or this week at a glance. Overdue items surface at the top, anytime todos sit alongside scheduled work.
  2. **Filter by Type** — Tap to see just events, just todos, or just bills. Default view weaves them together by date.
  3. **Color-Coded by Member** — Each family member's items carry their color, so you can scan who's responsible at a glance.

### Vault

All current copy unchanged. Only addition: phone mockup overlapping the existing `vault_main.png`.

### Mental Load vs Familite Way comparison band

Right column ("The Familite Way") — replace stale bullets:
- "Live, timezone-aware event syncing" → "One timeline for events, todos, and bills"
- "AI-powered transaction parsing (via Google Vertex AI)" → "AI-drafted transactions and bills you approve"

Left column ("The Mental Load") — generalize one bullet:
- Replace the timezone-math bullet with: "Bills due dates buried in three different inboxes."

---

## Nav

Desktop nav (sm+):

```
[logo]   Money   Bills   Planning   Vault   [Join Beta]
```

- Add `<a href="#bills">Bills</a>` between Money and Planning.
- Rename Finance link to Money; update `href` to `#money`.
- No changes to mobile nav (section links already hidden below `sm`).

---

## CTAs

Button copy unchanged:
- Hero: "Build Your Family Space — Free" → `https://app.familite.co`
- Bottom: "Get Early Access — Free" → `https://app.familite.co`
- Nav: "Join Beta" → `https://app.familite.co`

**App Store + Play Store badges** appear in two places:
1. **Hero** — directly under the "Build Your Family Space — Free" button (replacing the earlier text-cue idea).
2. **Bottom CTA section** — directly under the "Get Early Access — Free" button.

Both placements use the same badge pair, same URLs (`https://app.familite.co` until store listings exist). When real listings go live, both placements swap together via a single template change.

Closed-beta framing remains in the headline copy ("Founding Families", "We are currently in a closed beta") — badges signal *where the product runs*, not *where to install it today*.

---

## Mobile screenshots needed

User will provide all mobile screenshots directly. Drop them into `familite.co/assets/` using these exact filenames so the implementation can reference them without further changes:

| Section  | Filename                  | Suggested screen content                          |
|----------|---------------------------|---------------------------------------------------|
| Hero     | `mobile_hero.png`         | Money home (most recognizable mobile screen)      |
| Money    | `mobile_money.png`        | Money home or Pulse view                          |
| Bills    | `mobile_bills.png`        | Bills inbox / list view                           |
| Planning | `mobile_planning.png`     | Planning timeline (events + todos + bills)        |
| Vault    | `mobile_vault.png`        | Vault home                                        |

Resolution guidance: native phone resolution (~1080–1290 px wide) at 9:19.5 aspect, PNG with transparent or solid app background. The CSS phone frame does not impose a specific aspect ratio override — image is rendered with `object-cover` inside the frame.

---

## Secondary page additions

Targeted additions only. No rewriting of existing copy.

### `privacy.html`

1. **Bill Uploads & AI Parsing** — new subsection mirroring the existing "Bank Statement Uploads & AI Processing" block. Same shape: storage in Google Cloud Storage, parsing via Vertex AI, request-scoped (no model training, no retention by Vertex), user reviews drafts before save, deletable on request.
2. **Email Forwarding for Bills** — new subsection. Each family gets an auto-generated forwarding address (e.g. `bills+<family-id>@familite.co`). Forwarded emails (subject, body, sender, attachments) are processed by the same Vertex AI parsing pipeline used for bank statements; only the parsed draft and original email/attachments are stored against the family. Sender addresses outside the family's allowlist are rejected. Note that future paid tiers may allow customizing the forwarding address; data handling does not change.
3. **Todos retention** — one-line addition under the existing "Data Retention" list: "Todos: retained while your account is active. You can delete individual todos from within the app at any time."
4. **Planning timeline clarification** — one sentence in the Planning/Calendar area: "The Planning view in Familite displays your events, todos, and bills together — it doesn't introduce new data types beyond those covered above. Google Calendar sync is governed by the section above."

### `terms.html`

1. **Bill parsing disclaimer** — new bullet/paragraph in the existing AI-parsing block: "AI-extracted bills (from PDFs or forwarded emails) are drafts and may contain inaccuracies. You are responsible for reviewing, confirming, and editing bills before saving."
2. **Familite does not pay bills** — new bullet/paragraph (high-priority liability line): "Familite tracks bills and helps you stay on top of due dates. We do not process payments, hold funds, or autopay. Marking a bill as paid is a record-keeping action only."
3. **Email forwarding for bills** — one sentence covering the new ingress channel: "When you forward an email to your family's bill inbox address, the email and any attachments are processed by the same AI parsing pipeline that handles bank statements, subject to the Privacy Policy."
4. **Todos** — generically covered by existing "user content" terms; no addition unless legal asks for one.

### `about.html`

1. **Cross-platform surfaces** — one sentence in **Our Core Philosophy** (or as a new fourth pillar): "Familite is one product across **Web, iOS, iPadOS, and Android** — your family's space, on whatever device they reach for."
2. *(Optional)* In the **Organizer** card, expand "automation (like PDF parsing)" → "automation (like PDF parsing for statements and bills)". Single-word edit; preserves voice.

---

## Out of scope

- A dedicated "beta invite" landing page. Badges link to `https://app.familite.co` for now; a `/beta-invite` page is a separate task if/when desired.
- Changes to `assets/brand.css` beyond minor additions for the phone frame and badge spacing.
- Custom badge artwork — use Apple's and Google's official assets verbatim.
- Dark-mode tuning beyond what tailwind classes already provide (light/dark badge variants are dropped in via `dark:hidden` / `hidden dark:block` pattern already used in the nav logo).
- Rewording existing About / Privacy / Terms copy beyond the targeted additions above.

---

## Definition of done

- `index.html` renders all 4 feature sections with web + phone pairings.
- New Bills section present between Money and Planning.
- Planning copy reflects timeline + events/todos/bills (no calendar/timezone framing).
- Nav has Bills link; Finance is renamed to Money.
- App Store + Play Store badges visible under both the hero CTA and the bottom CTA, with `Web · iPadOS also available` microcopy.
- All four badge URLs (2 placements × 2 stores) currently point to `https://app.familite.co` and are templated for one-edit swap to real store URLs.
- Page lays out cleanly on mobile (<640px), tablet (640–1024px), and desktop (≥1024px).
- `privacy.html` includes Bill parsing, Todos retention, Planning clarification additions.
- `terms.html` includes Bill parsing disclaimer + "Familite does not pay bills" liability line.
- `about.html` mentions cross-platform surfaces (Web, iOS, iPadOS, Android).
- All About / Privacy / Terms additions are *additive* — no existing paragraphs reworded.

---

## Open questions — resolved

1. **Bill email forwarding** — ✅ Resolved. Inbox accepts forwarded emails via auto-generated family-scoped addresses. Future paid tiers may allow customizing the address. `privacy.html` and `terms.html` additions cover this.
2. **Mobile screenshots** — ✅ Resolved. User will provide. Required filenames listed in the Mobile screenshots section above.
3. **Recurring bills** — ✅ Resolved. Feature does not exist. Bills bullet #2 rewritten to drop the "Recurring bills repeat automatically" claim.
4. **Badge URL placeholder** — ✅ Resolved. `https://app.familite.co` for now in all four placements.
