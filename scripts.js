/* ==========================================================================
   INND.com — runtime
   - JSON content loaders
   - smooth scroll polish + scroll-reveal
   - quote-widget tier switcher (Tier 1 default)
   - sub-penny price formatter
   ========================================================================== */

(() => {
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const QUOTE_TIER = (window.INND_QUOTE_TIER ?? Number(document.body.dataset.tier ?? 1));

  // ---------- footer dynamic bits ----------
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- JSON loader ----------
  async function loadJSON(path) {
    try {
      const r = await fetch(path, { cache: 'no-store' });
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
  async function renderLeadership() {
    const d = await loadJSON('/data/leadership.json');
    if (!d) return;
    setText('[data-leadership="eyebrow"]', d.eyebrow);
    setText('[data-leadership="heading"]', d.heading);
    setText('[data-leadership="intro"]', d.intro);
    const grid = $('[data-leadership="leaders"]');
    if (grid && Array.isArray(d.leaders)) {
      grid.innerHTML = d.leaders.map(l => `
        <article class="leader-card">
          <p class="leader-name">${escapeHTML(l.name)}</p>
          <p class="leader-title">${escapeHTML(l.title)}</p>
          <p>${escapeHTML(l.bio)}</p>
        </article>`).join('');
    }
    const note = $('[data-leadership="additional_leaders_note"]');
    if (note && d.additional_leaders_note) {
      // Strip HTML-comment portion before display
      note.textContent = d.additional_leaders_note.replace(/<!--[\s\S]*?-->/g, '').trim();
    }
  }

  // ---------- FINANCIAL HIGHLIGHTS ----------
  async function renderFinancials() {
    const data = await loadJSON('/data/financial-highlights.json');
    if (!data) return;
    const grid = $('[data-financials="cards"]');
    if (grid && Array.isArray(data)) {
      grid.innerHTML = data.map(c => `
        <div class="metric-card">
          <p class="metric-label">${escapeHTML(c.label)}</p>
          <p class="metric-value">${escapeHTML(c.value)}</p>
          <p class="metric-context">${escapeHTML(c.context)}</p>
          <p class="metric-footnote">${escapeHTML(c.footnote)}</p>
        </div>`).join('');
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

  // ---------- Tier 3 custom widget (skeleton — wired but inactive at tier 1) ----------

  function formatSubPennyPrice(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    return n.toFixed(4);
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
        <p class="quote-price" id="quote-price">—</p>
        <p class="quote-change" id="quote-change"></p>
        <p class="quote-meta" id="quote-meta">Fetching latest quote…</p>
      </div>`;
    try {
      const r = await fetch('/.netlify/functions/quote');
      if (!r.ok) throw new Error(String(r.status));
      const q = await r.json();
      $('#quote-price').textContent = formatSubPennyPrice(Number(q.price));
      const ch = Number(q.changePct ?? 0);
      const dir = ch > 0 ? '▲' : ch < 0 ? '▼' : '—';
      const el = $('#quote-change');
      el.textContent = `${dir} ${Math.abs(ch).toFixed(2)}%`;
      el.style.color = ch > 0 ? 'var(--color-accent-2)' : ch < 0 ? 'var(--color-danger)' : 'inherit';
      const time = new Date(q.ts).toLocaleTimeString();
      $('#quote-meta').textContent = q.mock
        ? 'Synthetic data shown (no API key set). Activate live by adding POLYGON_API_KEY in Netlify env vars.'
        : `As of ${time} · Source: ${q.source} · Rounded to nearest 0.0001`;
      // Status pill: pulse dot for live, static badge for mock
      const status = $('#quote-status');
      if (q.mock) {
        status.classList.add('is-mock');
        status.querySelector('.quote-status-text').textContent = 'MOCK';
      } else {
        status.classList.add('is-live');
        status.querySelector('.quote-status-text').textContent = 'LIVE';
      }
      // Mirror the price into ir-glance "Last" cell if present
      const lastCell = document.querySelector('[data-glance="last"]');
      if (lastCell) lastCell.textContent = `$${formatSubPennyPrice(Number(q.price))}`;
    } catch (err) {
      $('#quote-meta').textContent = 'Live data temporarily unavailable. See OTC Markets for execution-grade pricing.';
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
      renderTimeline(),
      renderCurrent(),
      renderBrands(),
      renderLeadership(),
      renderFinancials(),
      renderPress(),
      renderContacts(),
      renderDisclaimers()
    ]).finally(() => {
      initReveal();
      mountTickerWidgets();
    });
  });
})();
