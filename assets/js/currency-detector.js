(function () {
  'use strict';

  const EU_CODES = new Set([
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
    'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'
  ]);

  function currencyFromCountry(code) {
    if (code === 'ID') return 'IDR';
    if (code === 'SG') return 'SGD';
    if (code === 'US') return 'USD';
    if (EU_CODES.has(code)) return 'EUR';
    return 'USD';
  }

  async function detectCountry() {
    try {
      const res = await fetch('/cdn-cgi/trace', { cache: 'no-store' });
      if (!res.ok) return null;
      const text = await res.text();
      const m = text.match(/^loc=([A-Z]{2})$/m);
      return m ? m[1] : null;
    } catch (_) {
      return null;
    }
  }

  function applyCurrency(currency) {
    document.querySelectorAll('[data-currency]').forEach(function (el) {
      el.hidden = el.dataset.currency !== currency;
    });
  }

  (async function () {
    const country = await detectCountry();
    if (!country) return;
    applyCurrency(currencyFromCountry(country));
    document.documentElement.dataset.detectedCountry = country;
  })();
})();
