/* ==========================================================================
   INND.com runtime
   - JSON content loaders
   - smooth scroll polish + scroll-reveal
   - quote-widget tier switcher (Tier 1 default)
   - sub-penny price formatter
   ========================================================================== */

(() => {
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Quote-widget tier resolution. Order of precedence:
  //   1. URL query param ?tier=N    (handy for live preview without redeploy)
  //   2. window.INND_QUOTE_TIER     (set before scripts.js loads)
  //   3. <body data-tier="N">       (default; controls the published tier)
  const QUOTE_TIER = (() => {
    const fromUrl = Number(new URLSearchParams(location.search).get('tier'));
    if (fromUrl === 1 || fromUrl === 2 || fromUrl === 3) return fromUrl;
    if (window.INND_QUOTE_TIER) return Number(window.INND_QUOTE_TIER);
    return Number(document.body.dataset.tier ?? 1);
  })();

  // ---------- footer dynamic bits ----------
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- JSON loader ----------
  async function loadJSON(path) {
    try {
      const r = await fetch(path);
      if (!r.ok) throw new Error(`${path}: ${r.status}`);
      return await r.json();
    } catch (err) {
      console.error('[INND] JSON load failed', path, err);
      return null;
    }
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el && value != null) el.textContent = value;
  }

  // All innerHTML template strings below interpolate only via escapeHTML() —
  // every user-supplied or data-file value is entity-escaped before insertion.
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ---------- HERO ----------
  async function renderHero() {
    const data = await loadJSON('/data/hero.json');
    if (!data) return;
    setText('[data-hero="eyebrow"]', data.eyebrow);
    setText('[data-hero="headline"]', data.headline);
    setText('[data-hero="subhead"]', data.subhead);

    const badges = $('[data-hero="badges"]');
    if (badges && Array.isArray(data.badges)) {
      badges.innerHTML = data.badges.map(b => `<li>${escapeHTML(b)}</li>`).join('');
    }
    const ctas = $('[data-hero="ctas"]');
    if (ctas && Array.isArray(data.ctas)) {
      ctas.innerHTML = data.ctas.map(c =>
        `<a class="btn btn-${c.variant === 'primary' ? 'primary' : 'secondary'}" href="${escapeHTML(c.href)}">${escapeHTML(c.label)}</a>`
      ).join('');
    }
  }

  // ---------- LEGACY ----------
  async function renderLegacy() {
    const d = await loadJSON('/data/legacy.json');
    if (!d) return;
    setText('[data-legacy="eyebrow"]', d.eyebrow);
    setText('[data-legacy="heading"]', d.heading);
    setText('[data-legacy="intro"]', d.intro);
    const body = $('[data-legacy="body"]');
    if (body && Array.isArray(d.body)) {
      body.innerHTML = d.body.map(p => `<p>${escapeHTML(p)}</p>`).join('');
    }
  }

  // ---------- ABOUT US ----------
  async function renderAbout() {
    const d = await loadJSON('/data/about.json');
    if (!d) return;
    setText('[data-about="eyebrow"]', d.eyebrow);
    setText('[data-about="heading"]', d.heading);
    const prose = $('[data-about="paragraphs"]');
    if (prose && Array.isArray(d.paragraphs)) {
      prose.innerHTML = d.paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('');
    }
  }

  // ---------- TRACK RECORD ----------
  async function renderTrackRecord() {
    const d = await loadJSON('/data/track-record.json');
    if (!d) return;
    setText('[data-track="eyebrow"]', d.eyebrow);
    setText('[data-track="heading"]', d.heading);
    const list = $('[data-track="items"]');
    if (list && Array.isArray(d.items)) {
      list.innerHTML = d.items.map(i => `<li>${escapeHTML(i)}</li>`).join('');
    }
  }

  // ---------- TIMELINE ----------
  async function renderTimeline() {
    const d = await loadJSON('/data/timeline.json');
    if (!d) return;
    setText('[data-timeline="eyebrow"]', d.eyebrow);
    setText('[data-timeline="heading"]', d.heading);
    const list = $('[data-timeline="events"]');
    if (list && Array.isArray(d.events)) {
      list.innerHTML = d.events.map(ev => `
        <li>
          <p class="timeline-year">${escapeHTML(ev.year)}</p>
          <p class="timeline-title">${escapeHTML(ev.title)}</p>
          <p class="timeline-summary">${escapeHTML(ev.summary)}</p>
        </li>`).join('');
    }
  }

  // ---------- CURRENT CHAPTER ----------
  async function renderCurrent() {
    const d = await loadJSON('/data/current-chapter.json');
    if (!d) return;
    setText('[data-current="eyebrow"]', d.eyebrow);
    setText('[data-current="heading"]', d.heading);
    setText('[data-current="callout"]', d.callout);
    const prose = $('[data-current="paragraphs"]');
    if (prose && Array.isArray(d.paragraphs)) {
      prose.innerHTML = d.paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('');
    }
    const links = $('[data-current="links"]');
    if (links && Array.isArray(d.links)) {
      links.innerHTML = d.links.map(l =>
        `<li><a href="${escapeHTML(l.href)}"${l.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(l.label)} →</a></li>`
      ).join('');
    }
  }

  // ---------- BRANDS ----------
  async function renderBrands() {
    const d = await loadJSON('/data/brands.json');
    if (!d) return;
    setText('[data-brands="eyebrow"]', d.eyebrow);
    setText('[data-brands="heading"]', d.heading);
    setText('[data-brands="intro"]', d.intro);
    const grid = $('[data-brands="brands"]');
    if (grid && Array.isArray(d.brands)) {
      grid.innerHTML = d.brands.map(b => `
        <article class="brand-card">
          <h3>${escapeHTML(b.name)}</h3>
          <p class="tagline">${escapeHTML(b.tagline || '')}</p>
          <p>${escapeHTML(b.description || '')}</p>
          ${b.channels?.length ? `<p class="channels"><strong>Available:</strong> ${b.channels.map(escapeHTML).join(' &middot; ')}</p>` : ''}
          ${b.purchase_url ? `<p><a href="${escapeHTML(b.purchase_url)}" target="_blank" rel="noopener noreferrer">Shop on OTCHealthMart →</a></p>` : ''}
        </article>`).join('');
    }
  }

  // ---------- LEADERSHIP ----------
  function getInitials(name) {
    return String(name || '').split(/\s+/).map(p => p[0] || '').join('').slice(0, 2).toUpperCase();
  }

  async function renderLeadership() {
    const d = await loadJSON('/data/leadership.json');
    if (!d) return;
    setText('[data-leadership="eyebrow"]', d.eyebrow);
    setText('[data-leadership="heading"]', d.heading);
    setText('[data-leadership="intro"]', d.intro);
    const grid = $('[data-leadership="leaders"]');
    if (grid && Array.isArray(d.leaders)) {
      grid.innerHTML = d.leaders.map(l => {
        const initials = getInitials(l.name);
        const avatarInner = l.photo
          ? `<img src="/assets/photos/${escapeHTML(l.photo)}" alt="" class="leader-photo" loading="lazy" decoding="async">`
          : `<span class="leader-monogram" aria-hidden="true">${escapeHTML(initials)}</span>`;
        return `
          <article class="leader-card">
            <div class="leader-card-head">
              <div class="leader-avatar">${avatarInner}</div>
              <div class="leader-meta">
                <p class="leader-name">${escapeHTML(l.name)}</p>
                <p class="leader-title">${escapeHTML(l.title)}</p>
              </div>
            </div>
            <p class="leader-bio">${escapeHTML(l.bio)}</p>
          </article>`;
      }).join('');
    }
    const note = $('[data-leadership="additional_leaders_note"]');
    if (note && d.additional_leaders_note) {
      note.textContent = d.additional_leaders_note.replace(/<!--[\s\S]*?-->/g, '').trim();
    }
  }

  // ---------- BUSINESS HIGHLIGHTS ----------
  async function renderBusinessHighlights() {
    const d = await loadJSON('/data/business-highlights.json');
    if (!d) return;
    setText('[data-highlights="eyebrow"]', d.eyebrow);
    setText('[data-highlights="heading"]', d.heading);
    setText('[data-highlights="intro"]', d.intro);
    const grid = $('[data-highlights="items"]');
    if (grid && Array.isArray(d.items)) {
      grid.innerHTML = d.items.map(it => `
        <article class="highlight-card">
          ${it.image ? `<img class="highlight-img" src="/assets/photos/${escapeHTML(it.image)}.jpg" alt="${escapeHTML(it.image_alt || '')}" loading="lazy" decoding="async">` : ''}
          <h3>${escapeHTML(it.title)}</h3>
          <p>${escapeHTML(it.body)}</p>
        </article>`).join('');
    }
  }

  // ---------- PRESS RELEASES ----------
  async function renderPress() {
    const data = await loadJSON('/data/press-releases.json');
    if (!data) return;
    const list = $('[data-press="list"]');
    if (!list || !Array.isArray(data)) return;
    const sorted = [...data].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    list.innerHTML = sorted.map(p => `
      <li>
        <p class="press-date">${escapeHTML(p.date)}</p>
        <p class="press-title"><a href="${escapeHTML(p.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(p.title)}</a></p>
        <p class="press-summary">${escapeHTML(p.summary)}</p>
        ${p.tag ? `<span class="press-tag">${escapeHTML(p.tag)}</span>` : ''}
      </li>`).join('');
  }

  // ---------- CONTACTS + DISCLAIMERS ----------
  async function renderContacts() {
    const c = await loadJSON('/data/contacts.json');
    if (!c) return;
    $$('[data-contact]').forEach(el => {
      const key = el.dataset.contact;
      const val = c[key];
      if (!val) return;
      el.textContent = val;
      if (el.tagName === 'A') el.setAttribute('href', `mailto:${val}`);
    });
  }

  async function renderDisclaimers() {
    const d = await loadJSON('/data/disclaimers.json');
    if (!d) return;
    setText('[data-disclosure="footer-heading"]', d.footer_heading);
    setText('[data-disclosure="quote-delay"]', d.quote_delay);
    setText('[data-disclosure="short-callout"]', d.short_callout);

    const body = $('[data-disclosure="footer-body"]');
    if (body && Array.isArray(d.footer_body)) {
      body.innerHTML = d.footer_body.map(p => `<p>${escapeHTML(p)}</p>`).join('');
    }
  }

  // ---------- TICKER WIDGETS (tier 1 = TradingView) ----------

  function injectTradingViewSymbolOverview(mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const wrap = document.createElement('div');
    wrap.className = 'tradingview-widget-container';
    mount.appendChild(wrap);

    const inner = document.createElement('div');
    inner.className = 'tradingview-widget-container__widget';
    wrap.appendChild(inner);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [['INND', 'OTC:INND|1Y']],
      chartOnly: false,
      width: '100%',
      height: 280,
      locale: 'en',
      colorTheme: 'dark',
      autosize: false,
      showVolume: false,
      hideDateRanges: false,
      scalePosition: 'right',
      scaleMode: 'Normal',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      noTimeScale: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      lineWidth: 2
    });
    wrap.appendChild(script);
  }

  function injectTradingViewAdvancedChart(mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const wrap = document.createElement('div');
    wrap.className = 'tradingview-widget-container';
    mount.appendChild(wrap);

    const inner = document.createElement('div');
    inner.className = 'tradingview-widget-container__widget';
    wrap.appendChild(inner);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: 'OTC:INND',
      autosize: true,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'light',
      style: '1',
      locale: 'en',
      hide_side_toolbar: false,
      allow_symbol_change: false,
      withdateranges: true,
      hide_volume: false,
      support_host: 'https://www.tradingview.com'
    });
    wrap.appendChild(script);
  }

  // ---------- Tier 3 custom widget (skeleton, wired but inactive at tier 1) ----------

  function formatSubPennyPrice(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '-';
    // Sub-penny stocks: keep 4-6 decimals, trim trailing zeros, always show $0.0001 not $0
    if (n === 0) return '0.0000';
    const abs = Math.abs(n);
    if (abs >= 1) return n.toFixed(2);
    if (abs >= 0.01) return n.toFixed(4);
    return n.toFixed(6).replace(/0+$/, '').replace(/\.$/, '.0');
  }
  function formatVolume(v) {
    if (!v || !isFinite(v)) return '-';
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(2) + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K';
    return String(Math.round(v));
  }
  function formatMarketCap(mc) {
    if (!mc || !isFinite(mc)) return '-';
    if (mc >= 1_000_000_000) return '$' + (mc / 1_000_000_000).toFixed(2) + 'B';
    if (mc >= 1_000_000) return '$' + (mc / 1_000_000).toFixed(2) + 'M';
    if (mc >= 1_000) return '$' + (mc / 1_000).toFixed(1) + 'K';
    return '$' + Math.round(mc);
  }
  function formatShares(s) {
    if (!s || !isFinite(s)) return '-';
    if (s >= 1_000_000_000) return (s / 1_000_000_000).toFixed(2) + 'B';
    if (s >= 1_000_000) return (s / 1_000_000).toFixed(1) + 'M';
    if (s >= 1_000) return (s / 1_000).toFixed(1) + 'K';
    return String(Math.round(s));
  }

  async function renderCustomQuote(mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = `
      <div class="quote-card">
        <div class="quote-header">
          <span class="quote-symbol">INND</span>
          <span class="quote-status" id="quote-status" aria-live="polite">
            <span class="live-dot" aria-hidden="true"></span>
            <span class="quote-status-text">Loading…</span>
          </span>
        </div>
        <p class="quote-price" id="quote-price">-</p>
        <p class="quote-change" id="quote-change"></p>
        <dl class="quote-stats" id="quote-stats" aria-label="Stock at a glance">
          <div><dt>Volume</dt><dd id="quote-volume">-</dd></div>
          <div><dt>Day range</dt><dd id="quote-day-range">-</dd></div>
          <div><dt>52-wk range</dt><dd id="quote-year-range">-</dd></div>
          <div><dt>Market cap</dt><dd id="quote-market-cap">-</dd></div>
        </dl>
        <p class="quote-meta" id="quote-meta">Fetching latest quote…</p>
        <p class="quote-link"><a href="https://www.otcmarkets.com/stock/INND/overview" target="_blank" rel="noopener noreferrer">View live on OTC Markets →</a></p>
      </div>`;
    try {
      const r = await fetch('/.netlify/functions/quote');
      if (!r.ok) throw new Error(String(r.status));
      const q = await r.json();

      // Price (large)
      $('#quote-price').textContent = '$' + formatSubPennyPrice(Number(q.price));

      // Change line: arrow + dollar change + percent change
      const ch = Number(q.changePct ?? 0);
      const chAbs = Number(q.change ?? 0);
      const dir = ch > 0 ? '▲' : ch < 0 ? '▼' : '-';
      const sign = chAbs >= 0 ? '+' : '';
      const chEl = $('#quote-change');
      chEl.textContent = `${dir} ${sign}${formatSubPennyPrice(chAbs)} (${sign}${ch.toFixed(2)}%) Today`;
      chEl.classList.remove('is-up', 'is-down', 'is-flat');
      chEl.classList.add(ch > 0 ? 'is-up' : ch < 0 ? 'is-down' : 'is-flat');

      // Stats grid
      $('#quote-volume').textContent = formatVolume(Number(q.volume ?? 0));
      $('#quote-day-range').textContent = `$${formatSubPennyPrice(q.dayLow)} to $${formatSubPennyPrice(q.dayHigh)}`;
      $('#quote-year-range').textContent = `$${formatSubPennyPrice(q.yearLow)} to $${formatSubPennyPrice(q.yearHigh)}`;
      $('#quote-market-cap').textContent = formatMarketCap(Number(q.marketCap ?? 0));

      // Meta line
      const time = new Date(q.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      $('#quote-meta').textContent = q.mock
        ? 'Synthetic data shown. Activate live by adding POLYGON_API_KEY in Netlify env vars.'
        : `As of ${time} · Source: ${q.source === 'tradingview' ? 'TradingView' : q.source === 'yahoo' ? 'Yahoo Finance' : q.source} · Quotes delayed ~${q.delayedMinutes ?? 15} min`;

      // Status pill
      const status = $('#quote-status');
      status.classList.remove('is-mock', 'is-live', 'is-error');
      if (q.mock) {
        status.classList.add('is-mock');
        status.querySelector('.quote-status-text').textContent = 'MOCK';
      } else {
        status.classList.add('is-live');
        status.querySelector('.quote-status-text').textContent = 'LIVE';
      }

      // Mirror price into ir-glance "Last" cell if present
      const lastCell = document.querySelector('[data-glance="last"]');
      if (lastCell) lastCell.textContent = '$' + formatSubPennyPrice(Number(q.price));
    } catch (err) {
      $('#quote-meta').textContent = 'Live data temporarily unavailable. View on OTC Markets for execution-grade pricing.';
      const status = $('#quote-status');
      if (status) {
        status.classList.add('is-error');
        status.querySelector('.quote-status-text').textContent = 'OFFLINE';
      }
    }
  }

  function mountTickerWidgets() {
    if (QUOTE_TIER === 3) {
      renderCustomQuote('hero-ticker-mount');
      injectTradingViewAdvancedChart('ir-chart-mount');
    } else {
      // Tier 1 (default) and Tier 2 both lean on TradingView for the visuals.
      injectTradingViewSymbolOverview('hero-ticker-mount');
      injectTradingViewAdvancedChart('ir-chart-mount');
    }
  }

  // ---------- scroll reveal ----------
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('[data-reveal]').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    $$('[data-reveal]').forEach(el => io.observe(el));
  }

  // ---------- init ----------
  document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
      renderHero(),
      renderLegacy(),
      renderAbout(),
      renderTrackRecord(),
      renderTimeline(),
      renderCurrent(),
      renderBrands(),
      renderLeadership(),
      renderBusinessHighlights(),
      renderPress(),
      renderContacts(),
      renderDisclaimers()
    ]).finally(() => {
      initReveal();
      mountTickerWidgets();
    });
  });
})();

/* ===== Mobile navigation ===== */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('mobile-nav');
  const close  = document.getElementById('mobile-nav-close');
  if (!toggle || !nav) return;

  function openNav() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () =>
    nav.classList.contains('is-open') ? closeNav() : openNav()
  );
  if (close) close.addEventListener('click', closeNav);

  // Close on backdrop click (outside the panel)
  nav.addEventListener('click', e => { if (e.target === nav) closeNav(); });

  // Close when a same-page anchor link is tapped
  nav.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeNav));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
  });
});

/* ===== Shareholder updates signup (posts to /.netlify/functions/signup) ===== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shareholder-signup-form');
  if (!form) return;
  const status = form.querySelector('[data-signup-status]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (status) status.textContent = 'Submitting...';
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    const payload = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      email: form.email.value.trim(),
      consent: form.consent.checked,
      company: form.company ? form.company.value : ''
    };
    try {
      const r = await fetch('/.netlify/functions/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error('status ' + r.status);
      const data = await r.json();
      // All innerHTML below uses only hardcoded strings — no user input interpolated.
      if (data.deferred || data.queued) {
        form.innerHTML = '<p class="form-status">Thanks. We ran into a brief server delay — your info has been queued and you\'ll receive your credit code within 24 hours. If it doesn\'t arrive, email ir@innd.com.</p>';
      } else {
        form.innerHTML = '<p class="form-status">Thank you for joining. Check your email shortly for your personalized $50 OTCHealthMart credit code.</p>';
      }
    } catch (err) {
      if (status) status.textContent = 'Something went wrong. Please try again, or email ir@innd.com.';
      if (btn) btn.disabled = false;
    }
  });
});
