# familite.co — Region detection & multi-currency pricing plan

**Status:** v0.3 draft (2026-06-06) — for iteration.

> **v0.3 change (2026-06-06):** Dropped SGD currency variant. Singapore visitors see USD (via ROW default) on the landing page. Reduces inline variants from 4 to 3 currencies (IDR / EUR / USD), trims `currencyFromCountry()` by one branch, and shortens the testing matrix' SG expectation. See `familite-contracts/docs/PRICING.md` §4 "Why no SGD."
>
> **v0.2 change (2026-06-03):** Dropped EU waitlist CTA variant. EU users flow through the same "Start free in beta" CTA as everyone else (per `familite-contracts/docs/BILLING_TAX_STRATEGY.md` v0.3 §5).
**Companion to:** [`familite-contracts/docs/BILLING_TAX_STRATEGY.md`](../../familite-contracts/docs/BILLING_TAX_STRATEGY.md) (§1.6 covers the landing surface).
**Scope:** Just the landing page. Signup, checkout, and dashboard gating are out of scope (different repos).

---

## 1. Goal

When a visitor lands on familite.co/pricing.html (or sees the pricing block on index.html), they see prices in the right currency for their region without any manual currency switching:

- Indonesia → **IDR** (current default, no change)
- EU (27 member states) → **EUR** (same "Start free in beta" CTA as everyone else)
- United States, Singapore, and rest of world → **USD**

Detection is **best-effort**, not authoritative. The legal source-of-truth for billing region is `family.country` (set at signup), not the landing page. The landing page just shows the right number so users don't bounce.

---

## 2. Architecture

```
Browser
  │ GET familite.co/pricing.html
  ▼
Cloudflare (already in front, TLS terminated)
  │ proxies to origin
  ▼
GitHub Pages (static HTML)
  │ returns pricing.html
  ▼
Browser renders default (IDR), then:
  │ JS fires fetch('/cdn-cgi/trace')   ← Cloudflare endpoint
  ▼
parses loc=XX → swaps currency blocks → updates CTA for EU
```

Verified working as of 2026-06-03: `curl https://familite.co/cdn-cgi/trace` returns `loc=<2-letter ISO>` correctly.

**No backend dependency.** No third-party geo service. No Cloudflare Worker needed (Tier 1 of the BILLING_TAX_STRATEGY §1.6 plan).

---

## 3. HTML changes — multi-currency price blocks

### 3.1 Approach: inline variants with `data-currency` attribute

Each tier's price block ships **three currency variants** in the HTML. The IDR variant is shown by default (no `hidden` attribute); the other two are hidden. JS reveals the correct one and hides the others based on detected country.

**Why this approach (vs. JS-templated `data-price='{...}'`):**
- Works without JS (graceful degradation → user sees IDR)
- Crawlable by search engines in all currencies (all variants present in source)
- No flash of empty content — the IDR text is in the DOM at first paint
- Accessibility: screen readers read the visible variant
- Trade-off: ~3× the price markup. Acceptable for 4 tiers × 2 (monthly + annual) = 24 small blocks.

### 3.2 Pattern to apply to every tier card in `pricing.html`

**Before** (Plus tier, lines 235–240):
```html
<div class="mb-6">
  <p class="text-4xl font-bold text-gray-900 dark:text-white">
    Rp 49.000<span class="text-base font-normal brand-muted">/mo</span>
  </p>
  <p class="text-xs brand-muted mt-1">or Rp 449.000/yr</p>
</div>
```

**After:**
```html
<div class="mb-6" data-price-block>
  <p class="text-4xl font-bold text-gray-900 dark:text-white">
    <span data-currency="IDR">Rp 49.000<span class="text-base font-normal brand-muted">/mo</span></span>
    <span data-currency="USD" hidden>$9.99<span class="text-base font-normal brand-muted">/mo</span></span>
    <span data-currency="EUR" hidden>€9.99<span class="text-base font-normal brand-muted">/mo</span></span>
  </p>
  <p class="text-xs brand-muted mt-1">
    <span data-currency="IDR">or Rp 449.000/yr</span>
    <span data-currency="USD" hidden>or $89/yr</span>
    <span data-currency="EUR" hidden>or €89/yr</span>
  </p>
</div>
```

### 3.3 Price table to apply

| Tier | IDR /mo | IDR /yr | USD /mo | USD /yr | EUR /mo | EUR /yr |
|---|---|---|---|---|---|---|
| Free | Rp 0 (with ads) | — | $0 (with ads) | — | €0 (with ads) | — |
| Plus | Rp 49.000 | Rp 449.000 | $9.99 | $89 | €9.99 | €89 |
| Pro | Rp 99.000 | Rp 899.000 | $19.99 | $179 | €19.99 | €179 |
| Diamond | Rp 199.000 | Rp 1.790.000 | $39.99 | $379 | €39.99 | €379 |

> Numbers sourced from `familite-contracts/docs/PRICING.md` and `CAPABILITIES_MATRIX.md`. Annual = 12 × monthly × ~0.75 (25% off, rounded to clean numbers).

### 3.4 Free tier "Rp 0" handling

The Free tier price (`<p>Rp 0</p>` line 215) only varies in symbol — `$0`, `€0`, `Rp 0`. Apply the same pattern; subhead "with ads" stays identical across currencies.

### 3.5 CTA — single variant for everyone

Per v0.2 (EU compliance-debt decision), there's no EU-specific CTA. The existing `<a href="https://app.familite.co">Start free in beta</a>` stays untouched. **No HTML changes needed for the CTA — just currency.**

### 3.6 Pricing intro copy

Line 199-202 currently reads:
> "All tiers are free while we're in closed beta. The prices below are what each tier will cost when we exit beta — current beta families keep beta access through launch."

No copy change needed — this is currency-agnostic. The "Free during beta" copy applies regardless of region.

---

## 4. JS — `assets/js/currency-detector.js`

New file. ~60 lines. Vanilla JS, no framework.

```js
(function () {
  'use strict';

  const EU_CODES = new Set([
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
    'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'
  ]);

  function currencyFromCountry(code) {
    if (code === 'ID') return 'IDR';
    if (EU_CODES.has(code)) return 'EUR';
    return 'USD'; // US, SG, and all other ROW
  }

  async function detectCountry() {
    try {
      const res = await fetch('/cdn-cgi/trace', { cache: 'no-store' });
      if (!res.ok) return null;
      const text = await res.text();
      const m = text.match(/^loc=([A-Z]{2})$/m);
      return m ? m[1] : null;
    } catch (_) {
      return null; // fail open → IDR stays visible (default), no harm
    }
  }

  function applyCurrency(currency) {
    document.querySelectorAll('[data-currency]').forEach(el => {
      el.hidden = el.dataset.currency !== currency;
    });
  }

  (async () => {
    const country = await detectCountry();
    if (!country) return; // keep default (IDR)
    applyCurrency(currencyFromCountry(country));
    document.documentElement.dataset.detectedCountry = country; // for debugging
  })();
})();
```

### 4.1 Inclusion

Add to `pricing.html` and `index.html` `<head>` (before `</head>`):
```html
<script src="/assets/js/currency-detector.js" defer></script>
```

`defer` keeps the script async without blocking parse. The script runs after DOM parse, so `document.querySelectorAll` works without `DOMContentLoaded`.

### 4.2 Failure modes — all safe

| Failure | Behavior |
|---|---|
| `/cdn-cgi/trace` returns 404 (CF removed proxy) | Catch → no swap → IDR stays visible. No broken UI. |
| Network error (offline) | Same as above. |
| `loc=` line missing from trace | `match` returns null → no swap → IDR stays. |
| Country code unknown (e.g. new state) | Falls through to USD via ROW default. |
| User has JS disabled | No swap → IDR stays. ~0.5% of traffic. Acceptable. |

The defaults are intentionally IDR because the entity is Indonesian and 50%+ of expected traffic is local. Any other region falls back to USD which is correct for ROW.

---

## 5. Multi-repo price-sync process

This file's prices come from `PRICING.md` and must stay in sync with five other places. Document the update flow:

When a price changes, update in this order:

| # | File | Repo | What to change |
|---|---|---|---|
| 1 | `docs/PRICING.md` | `familite-contracts` | Source-of-truth tables |
| 2 | `docs/CAPABILITIES_MATRIX.md` | `familite-contracts` | Regional pricing table in §1 |
| 3 | `internal/billing/service/quota_service.go` (capsByPlan) | `familyhq-api` | If quota changes, not price |
| 4 | `lib/pricing-data.ts` (TIER_PRICING) | `familyhq-dashboard` | In-app `/pricing` page |
| 5 | **`pricing.html` (this repo)** | `familite.co` | Landing page price spans |
| 6 | (rebuild + deploy) | `familite.co` | GH Pages auto-redeploy on push |

A CI lint that diffs prices across (1) and (5) would be cheap insurance — defer for v1.

---

## 6. Testing matrix

Manual verification before merging:

| Region | Test method | Expected display | Expected CTA |
|---|---|---|---|
| ID | Real browser in Indonesia, or VPN to ID | IDR (Rp) | "Start free in beta" → app.familite.co |
| SG | VPN to Singapore | USD ($) via ROW default | "Start free in beta" → app.familite.co |
| US | VPN to United States | USD ($) | "Start free in beta" → app.familite.co |
| EU (DE, FR, …) | VPN to Germany | EUR (€) | "Start free in beta" → app.familite.co |
| ROW (e.g. GB, AU, JP) | VPN to UK | USD ($) | "Start free in beta" |
| JS-disabled | Browser dev tools → disable JS, reload | IDR (default) | "Start free in beta" (non-eu default) |
| CF endpoint down | Block `/cdn-cgi/trace` in dev tools → reload | IDR (default) | "Start free in beta" |
| Confirm `loc=` parse | Browser dev tools → `document.documentElement.dataset.detectedCountry` | Detected ISO code | n/a |

**Tools:** Mullvad or any consumer VPN with country selection covers all the regions above. Total verification time: ~30 min.

---

## 7. Deploy steps

1. Branch from main: `git checkout -b region-detection`
2. Apply HTML changes to `pricing.html` (4 tier cards × 2 price blocks × 3 currencies = 24 spans) and `index.html` (pricing snippet if any)
3. Add `assets/js/currency-detector.js`
4. Add `<script src="/assets/js/currency-detector.js" defer></script>` to both pages
5. Local test: `python3 -m http.server 8000` → check defaults render (no CF, so falls through to IDR)
6. Push branch, open PR, request preview deploy if GH Pages preview is configured
7. Manual test matrix from §6 against preview URL
8. Merge → main → GH Pages auto-deploy
9. Final smoke test against `https://familite.co/pricing.html` from VPN locations

**Rollback:** revert the merge commit; GH Pages re-deploys the prior state within ~2 min. No infra change required.

---

## 8. Out of scope (for this plan)

- **Signup-time region flagging** — EU subs get `vat_accrued=true` per BILLING_TAX_STRATEGY §5.3. That's `familyhq-api` / `familyhq-dashboard` work, not landing.
- **Backend pricing API** — explicitly rejected in BILLING_TAX_STRATEGY §1.6.
- **Dashboard `/pricing` page** — `familyhq-dashboard/app/pricing/page.tsx` already exists with proper `useResolvedPricing()` hook; no landing-repo work needed there.
- **Mobile ad-free wiring** — tracked in CAPABILITIES_MATRIX gap #13.
- **Beta-to-paid transition copy** — when billing actually flips on, the "Free during closed beta" banner copy will need updating. Separate change.

---

## 9. Open questions

1. ~~**EU waitlist destination**~~ Resolved 2026-06-03 (v0.2): no waitlist, EU CTA matches everyone else.
2. **Index.html pricing snippet** — does the homepage have its own pricing summary that needs the same treatment? Need to inspect `index.html`. If so, same pattern applies.
3. **Add a manual currency switcher?** Some users prefer USD even when in ID (e.g. expats). A small dropdown ("View prices in: IDR ▾") would let users override. Adds maybe 20 lines. Recommend deferring.
4. **Translation** — currency is region; *language* is a different problem. Landing page is English-only today. Out of scope for this plan, but worth flagging.

---

## 10. Definition of done

- [ ] HTML changes merged in `pricing.html` and `index.html`
- [ ] `assets/js/currency-detector.js` added
- [ ] All 7 rows of testing matrix (§6) pass
- [ ] PR description references this plan + BILLING_TAX_STRATEGY §1.6
- [ ] Prices in pricing.html match `PRICING.md` (manual diff before merge)
- [ ] Smoke test on production after deploy
